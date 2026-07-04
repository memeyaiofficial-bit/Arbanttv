/**
 * M-Pesa Daraja Integration — Service Layer
 *
 * Handles OAuth token generation, STK push initiation,
 * callback processing, and payment status queries.
 * Transactions are persisted to the DB via drizzle.
 */

import { eq } from "drizzle-orm";
import { db } from "../db";
import { transactions } from "../db/schema";
import crypto from "crypto";

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

/** Fetch a short-lived OAuth token from Daraja. */
async function getDarajaToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;

  if (!key || !secret)
    throw new Error("M-Pesa consumer credentials are not configured.");

  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Daraja auth failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

/** Build the Base64-encoded password for STK push requests. */
function buildPassword(timestamp: string): string {
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

/** Format a Date as YYYYMMDDHHmmss (Daraja timestamp format). */
function darajaTimestamp(date = new Date()): string {
  return date
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface STKPushParams {
  phoneNumber: string;
  amount: number;
  fullName: string;
  email: string;
  playlistName: string;
  userId?: string | null;
}

export interface STKPushResult {
  success: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  message?: string;
  error?: string;
}

export interface PaymentStatusResult {
  success: boolean;
  status: "pending" | "success" | "failed" | "cancelled";
  message?: string;
  resultCode?: string;
  error?: string;
}

/**
 * Initiate an STK push to the customer's phone.
 * Persists a transaction record (status=pending) immediately.
 */
export async function stkPush(params: STKPushParams): Promise<STKPushResult> {
  const { phoneNumber, amount, fullName, email, playlistName, userId } = params;

  // Server-side validation
  if (!phoneNumber || !amount || !fullName || !email) {
    return { success: false, error: "Missing required fields." };
  }

  if (!/^254[17]\d{8}$/.test(phoneNumber)) {
    return { success: false, error: "Invalid phone number format." };
  }

  if (amount < 1 || !Number.isInteger(amount)) {
    return {
      success: false,
      error: "Amount must be a positive integer (KES).",
    };
  }

  try {
    const token = await getDarajaToken();
    const timestamp = darajaTimestamp();
    const password = buildPassword(timestamp);
    const shortcode = process.env.MPESA_SHORTCODE;
    const partyb = process.env.MPESA_PARTYB;

    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    const transactionType =
      process.env.MPESA_TRANSACTION_TYPE?.trim() || "CustomerPayBillOnline";

    if (!shortcode || !callbackUrl) {
      return {
        success: false,
        error: "MPesa shortcode or callback URL is not configured.",
      };
    }

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: transactionType,
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: partyb,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: playlistName || "Playlist",
      TransactionDesc: `Payment for ${playlistName || "Playlist"} by ${fullName}`,
    };

    const stkRes = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== "0") {
      return {
        success: false,
        error:
          stkData.errorMessage ||
          stkData.ResponseDescription ||
          "STK push failed.",
      };
    }

    // Persist the transaction to the database
    const transactionId = crypto.randomUUID();
    try {
      await db.insert(transactions).values({
        id: transactionId,
        userId: userId || null,
        checkoutRequestId: stkData.CheckoutRequestID,
        merchantRequestId: stkData.MerchantRequestID || null,
        phoneNumber,
        amount,
        fullName,
        email,
        accountReference: playlistName || "Playlist",
        type: "playlist_purchase",
        status: "pending",
      });
    } catch (dbErr) {
      console.error(
        "[mpesa:stkPush] Warning: transaction persistence failed, but STK push succeeded.",
        dbErr,
      );
    }

    return {
      success: true,
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID,
      message: stkData.CustomerMessage,
    };
  } catch (err: unknown) {
    console.error("[mpesa:stkPush] Error:", err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : "Internal server error.";

    return {
      success: false,
      error: message.includes("Failed query")
        ? "Unable to persist the transaction. Please try again."
        : message,
    };
  }
}

/**
 * Process a callback from Safaricom.
 * Updates the transaction record with the result.
 * Always returns a 200 "Accepted" response shape so Safaricom stops retrying.
 */
export async function handleCallback(
  body: unknown,
): Promise<{ ResultCode: number; ResultDesc: string }> {
  try {
    const result = (body as any)?.Body?.stkCallback;
    if (!result) {
      return { ResultCode: 0, ResultDesc: "Accepted" };
    }

    const checkoutRequestId: string = result.CheckoutRequestID;
    const resultCode: number = result.ResultCode;

    let status: "success" | "failed" | "cancelled";
    let mpesaReceiptNumber: string | null = null;
    const resultDesc = result.ResultDesc ?? "";

    if (resultCode === 0) {
      status = "success";
      // Extract the M-Pesa receipt number from callback metadata
      if (result.CallbackMetadata?.Item) {
        for (const item of result.CallbackMetadata.Item) {
          if (item.Name === "MpesaReceiptNumber") {
            mpesaReceiptNumber = item.Value;
          }
        }
      }
    } else if (resultCode === 1032) {
      status = "cancelled";
    } else {
      status = "failed";
    }

    // Update the transaction in the database
    await db
      .update(transactions)
      .set({
        status,
        mpesaReceiptNumber,
        resultCode,
        resultDesc,
        updatedAt: new Date(),
      })
      .where(eq(transactions.checkoutRequestId, checkoutRequestId));

    return { ResultCode: 0, ResultDesc: "Accepted" };
  } catch (err) {
    console.error("[mpesa:handleCallback] Error:", err);
    return { ResultCode: 0, ResultDesc: "Accepted" };
  }
}

/**
 * Check payment status for a given CheckoutRequestID.
 * Checks the local DB first; falls back to querying Daraja directly.
 */
export async function queryPaymentStatus(
  checkoutRequestId: string,
): Promise<PaymentStatusResult> {
  if (!checkoutRequestId) {
    return {
      success: false,
      status: "pending",
      message: "checkoutRequestId is required.",
    };
  }

  try {
    // 1. Check local DB first
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.checkoutRequestId, checkoutRequestId));

    if (transaction && transaction.status !== "pending") {
      return {
        success: true,
        status: transaction.status,
        message: transaction.resultDesc || undefined,
        resultCode:
          transaction.resultCode !== null
            ? String(transaction.resultCode)
            : undefined,
      };
    }

    // 2. Query Daraja directly as fallback
    try {
      const token = await getDarajaToken();
      const timestamp = darajaTimestamp();
      const password = buildPassword(timestamp);

      const queryRes = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        }),
      });

      const queryData = await queryRes.json();
      const resultCode = queryData.ResultCode;

      if (resultCode === "0") {
        await db
          .update(transactions)
          .set({ status: "success", resultCode: 0, updatedAt: new Date() })
          .where(eq(transactions.checkoutRequestId, checkoutRequestId));

        return { success: true, status: "success" };
      }

      if (resultCode === "1032") {
        await db
          .update(transactions)
          .set({
            status: "cancelled",
            resultCode: 1032,
            resultDesc: queryData.ResultDesc,
            updatedAt: new Date(),
          })
          .where(eq(transactions.checkoutRequestId, checkoutRequestId));

        return {
          success: true,
          status: "cancelled",
          message: queryData.ResultDesc,
        };
      }

      if (resultCode !== undefined && resultCode !== "1037") {
        // 1037 = still in flight
        await db
          .update(transactions)
          .set({
            status: "failed",
            resultCode: Number(resultCode),
            resultDesc: queryData.ResultDesc,
            updatedAt: new Date(),
          })
          .where(eq(transactions.checkoutRequestId, checkoutRequestId));

        return {
          success: true,
          status: "failed",
          message: queryData.ResultDesc,
        };
      }
    } catch {
      // Daraja query failed — fall through to return pending
    }

    return { success: true, status: "pending" };
  } catch (err) {
    console.error("[mpesa:queryPaymentStatus] Error:", err);
    return {
      success: false,
      status: "pending",
      error: "Internal server error.",
    };
  }
}
