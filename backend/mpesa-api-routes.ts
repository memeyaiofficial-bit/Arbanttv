/**
 * M-Pesa Daraja API — Backend Routes
 *
 * Drop these two route handlers into your framework of choice.
 * Examples are written as Next.js App Router Route Handlers (Next 13+).
 * Adapt to Express / Hono / Fastify / etc. trivially.
 *
 * Required environment variables (add to .env):
 *
 *   MPESA_CONSUMER_KEY=...          # From Safaricom Developer Portal
 *   MPESA_CONSUMER_SECRET=...       # From Safaricom Developer Portal
 *   MPESA_SHORTCODE=...             # Paybill or Till number
 *   MPESA_PASSKEY=...               # Lipa Na M-Pesa Online Passkey
 *   MPESA_CALLBACK_URL=...          # Public HTTPS URL, e.g. https://yourdomain.com/api/mpesa/callback
 *   MPESA_ENV=sandbox               # "sandbox" | "production"
 */

import { NextRequest, NextResponse } from 'next/server';

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

/** Fetch a short-lived OAuth token from Daraja. */
async function getDarajaToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY!;
  const secret = process.env.MPESA_CONSUMER_SECRET!;

  if (!key || !secret) throw new Error('M-Pesa consumer credentials are not configured.');

  const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: { Authorization: `Basic ${credentials}` },
  });

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
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

/** Format a Date as YYYYMMDDHHmmss (Daraja timestamp format). */
function darajaTimestamp(date = new Date()): string {
  return date
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14);
}

// ── In-memory store for demo purposes ────────────────────────────────────────
// Replace with Redis / your DB in production so statuses survive server restarts.
const paymentStore = new Map<
  string, // CheckoutRequestID
  { status: 'pending' | 'success' | 'failed' | 'cancelled'; resultCode?: string; message?: string }
>();

// ── Route 1: POST /api/mpesa/stkpush ─────────────────────────────────────────

export async function POST_stkpush(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { phoneNumber, amount, fullName, email, playlistName } = body as {
      phoneNumber: string;
      amount: number;
      fullName: string;
      email: string;
      playlistName: string;
    };

    // Basic server-side validation
    if (!phoneNumber || !amount || !fullName || !email) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    if (!/^254[17]\d{8}$/.test(phoneNumber)) {
      return NextResponse.json({ success: false, error: 'Invalid phone number format.' }, { status: 400 });
    }

    if (amount < 1 || !Number.isInteger(amount)) {
      return NextResponse.json({ success: false, error: 'Amount must be a positive integer (KES).' }, { status: 400 });
    }

    const token = await getDarajaToken();
    const timestamp = darajaTimestamp();
    const password = buildPassword(timestamp);

    const stkPayload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline', // Use "CustomerBuyGoodsOnline" for Till numbers
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: playlistName || 'Playlist',
      TransactionDesc: `Payment for ${playlistName || 'Playlist'} by ${fullName}`,
    };

    const stkRes = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPayload),
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== '0') {
      return NextResponse.json(
        { success: false, error: stkData.errorMessage || stkData.ResponseDescription || 'STK push failed.' },
        { status: 502 }
      );
    }

    // Seed the store as pending so polling works immediately
    paymentStore.set(stkData.CheckoutRequestID, { status: 'pending' });

    // Optional: persist customer details to your DB here
    // await db.orders.create({ checkoutRequestId: stkData.CheckoutRequestID, fullName, email, amount, playlistName });

    return NextResponse.json({
      success: true,
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID,
      message: stkData.CustomerMessage,
    });
  } catch (err: unknown) {
    console.error('[stkpush] Error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Internal server error.' },
      { status: 500 }
    );
  }
}

// ── Route 2: POST /api/mpesa/callback ────────────────────────────────────────
// Safaricom POSTs payment results here. Must be publicly accessible over HTTPS.
// Use ngrok / Cloudflare Tunnel in development.

export async function POST_callback(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const result = body?.Body?.stkCallback;

    if (!result) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const checkoutRequestId: string = result.CheckoutRequestID;
    const resultCode: number = result.ResultCode;

    let status: 'success' | 'failed' | 'cancelled';
    let message = result.ResultDesc ?? '';

    if (resultCode === 0) {
      status = 'success';
    } else if (resultCode === 1032) {
      // User cancelled / request timed out on their handset
      status = 'cancelled';
    } else {
      status = 'failed';
    }

    paymentStore.set(checkoutRequestId, {
      status,
      resultCode: String(resultCode),
      message,
    });

    // TODO: update your DB here
    // await db.orders.update({ checkoutRequestId }, { status, resultCode });

    // Acknowledge Safaricom — always respond 200 quickly
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('[callback] Error:', err);
    // Still return 200 to stop Safaricom retries
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
}

// ── Route 3: POST /api/mpesa/status ──────────────────────────────────────────
// Polled by the frontend every 5 s to know when the user completes payment.

export async function POST_status(req: NextRequest): Promise<NextResponse> {
  try {
    const { checkoutRequestId } = (await req.json()) as { checkoutRequestId: string };

    if (!checkoutRequestId) {
      return NextResponse.json({ success: false, error: 'checkoutRequestId is required.' }, { status: 400 });
    }

    // 1. Check local store first (callback may have already arrived)
    const stored = paymentStore.get(checkoutRequestId);
    if (stored && stored.status !== 'pending') {
      return NextResponse.json({ success: true, ...stored });
    }

    // 2. Query Daraja directly as fallback (handles cases where callback was missed)
    try {
      const token = await getDarajaToken();
      const timestamp = darajaTimestamp();
      const password = buildPassword(timestamp);

      const queryRes = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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

      if (resultCode === '0') {
        paymentStore.set(checkoutRequestId, { status: 'success' });
        return NextResponse.json({ success: true, status: 'success' });
      }

      if (resultCode === '1032') {
        paymentStore.set(checkoutRequestId, { status: 'cancelled', resultCode });
        return NextResponse.json({ success: true, status: 'cancelled', message: queryData.ResultDesc });
      }

      if (resultCode !== undefined && resultCode !== '1037') {
        // 1037 = request still in flight / user hasn't responded yet
        paymentStore.set(checkoutRequestId, { status: 'failed', resultCode, message: queryData.ResultDesc });
        return NextResponse.json({ success: true, status: 'failed', message: queryData.ResultDesc });
      }
    } catch {
      // Daraja query failed — fall through and return pending
    }

    return NextResponse.json({ success: true, status: 'pending' });
  } catch (err) {
    console.error('[status] Error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
