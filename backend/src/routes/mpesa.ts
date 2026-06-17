/**
 * M-Pesa Daraja Integration — Express Routes
 *
 * POST /api/mpesa/stkpush   — Initiate STK push to customer's phone
 * POST /api/mpesa/callback  — Safaricom callback (public, no auth)
 * POST /api/mpesa/status    — Poll payment status
 */

import { Router } from "express";
import * as mpesaController from "../controllers/mpesa";

const router = Router();

// STK push — requires auth (so we can log the user)
router.post("/stkpush", mpesaController.stkPush);

// Callback — Safaricom pushes results here, no auth (public HTTPS)
router.post("/callback", mpesaController.callback);

// Status check — polling endpoint
router.post("/status", mpesaController.status);

export default router;
