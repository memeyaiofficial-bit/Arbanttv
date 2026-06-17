/**
 * M-Pesa Daraja Integration — Express Controllers
 */

import { Request, Response, NextFunction } from "express";
import * as mpesaService from "../services/mpesa";
import { extractUser } from "../utils/supabase";

export const stkPush = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = extractUser(req);
    const { phoneNumber, amount, fullName, email, playlistName } = req.body;

    const result = await mpesaService.stkPush({
      phoneNumber,
      amount,
      fullName,
      email,
      playlistName,
      userId: authUser?.id || null,
    });

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const callback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await mpesaService.handleCallback(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const status = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      res
        .status(400)
        .json({ success: false, error: "checkoutRequestId is required." });
      return;
    }

    const result = await mpesaService.queryPaymentStatus(checkoutRequestId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
