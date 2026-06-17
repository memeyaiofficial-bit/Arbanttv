/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistName?: string;
  price?: number;
}

type PaymentStatus =
  | "idle"
  | "initiating"
  | "pending"
  | "success"
  | "failed"
  | "cancelled";

interface STKPushResponse {
  success: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  message?: string;
  error?: string;
}

interface PaymentStatusResponse {
  success: boolean;
  status: "pending" | "success" | "failed" | "cancelled";
  message?: string;
  resultCode?: string;
}

// Validate Kenyan phone number and normalize to 254XXXXXXXXX
const normalizePhone = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, "");
  if (/^0[17]\d{8}$/.test(digits)) return "254" + digits.slice(1);
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  if (/^\+254[17]\d{8}$/.test(digits)) return digits.slice(1);
  return null;
};

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  playlistName,
  price = 600,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(
    null,
  );
  const [pollCount, setPollCount] = useState(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPaymentStatus("idle");
        setStatusMessage("");
        setCheckoutRequestId(null);
        setPollCount(0);
        setErrors({});
      }, 300);
    }
  }, [isOpen]);

  // Poll for payment status after STK push
  useEffect(() => {
    if (paymentStatus !== "pending" || !checkoutRequestId) return;

    const MAX_POLLS = 12; // 12 × 5s = 60 seconds timeout
    if (pollCount >= MAX_POLLS) {
      setPaymentStatus("failed");
      setStatusMessage(
        "Payment confirmation timed out. If you completed the payment, please contact support.",
      );
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/mpesa/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutRequestId }),
        });

        if (!res.ok) throw new Error("Status check failed");

        const data: PaymentStatusResponse = await res.json();

        if (data.status === "success") {
          setPaymentStatus("success");
          setStatusMessage("Payment received! Thank you.");
        } else if (data.status === "failed") {
          setPaymentStatus("failed");
          setStatusMessage(
            data.message || "Payment was not completed. Please try again.",
          );
        } else if (data.status === "cancelled") {
          setPaymentStatus("cancelled");
          setStatusMessage("You cancelled the payment. You can try again.");
        } else {
          // Still pending — keep polling
          setPollCount((c) => c + 1);
        }
      } catch {
        setPollCount((c) => c + 1); // retry silently on network blip
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [paymentStatus, checkoutRequestId, pollCount]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      next.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      next.email = "Email address is required.";
    } else if (!isValidEmail(formData.email)) {
      next.email = "Enter a valid email address.";
    }

    const normalized = normalizePhone(formData.phoneNumber);
    if (!formData.phoneNumber.trim()) {
      next.phoneNumber = "Phone number is required.";
    } else if (!normalized) {
      next.phoneNumber =
        "Enter a valid Safaricom number (e.g. 0712345678 or 254712345678).";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const phone = normalizePhone(formData.phoneNumber)!;
    setPaymentStatus("initiating");
    setStatusMessage("Sending STK push to your phone…");

    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
          amount: price,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          playlistName: playlistName || "Standard Playlist",
        }),
      });

      const data: STKPushResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initiate payment.");
      }

      setCheckoutRequestId(data.checkoutRequestId!);
      setPaymentStatus("pending");
      setStatusMessage(
        "Check your phone and enter your M-Pesa PIN to complete the payment.",
      );
    } catch (err: unknown) {
      setPaymentStatus("failed");
      setStatusMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const handleClose = () => {
    if (paymentStatus === "initiating" || paymentStatus === "pending") return; // block accidental close during flow
    onClose();
  };

  const isProcessing =
    paymentStatus === "initiating" || paymentStatus === "pending";

  // ── Status screens ────────────────────────────────────────────────────────
  const renderStatusScreen = () => {
    const icons: Record<string, string> = {
      initiating: "📡",
      pending: "📱",
      success: "✅",
      failed: "❌",
      cancelled: "↩️",
    };

    return (
      <div className="p-8 flex flex-col items-center justify-center gap-6 min-h-[260px] text-center">
        <div className="text-5xl animate-pulse">
          {icons[paymentStatus] ?? "⏳"}
        </div>

        {/* Spinner for active states */}
        {isProcessing && (
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        )}

        <p className="text-base font-semibold text-foreground leading-snug max-w-xs">
          {statusMessage}
        </p>

        {paymentStatus === "pending" && (
          <p className="text-xs text-muted-foreground">
            Waiting for confirmation… ({pollCount}/{12})
          </p>
        )}

        {(paymentStatus === "failed" || paymentStatus === "cancelled") && (
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setPaymentStatus("idle");
                setStatusMessage("");
                setCheckoutRequestId(null);
                setPollCount(0);
              }}
              className="bg-primary hover:bg-primary/90 h-10 px-6 font-semibold"
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={onClose} className="h-10 px-6">
              Cancel
            </Button>
          </div>
        )}

        {paymentStatus === "success" && (
          <Button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 h-10 px-8 font-semibold"
          >
            Done
          </Button>
        )}
      </div>
    );
  };

  // ── Form ──────────────────────────────────────────────────────────────────
  const renderForm = () => (
    <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-4">
          <span>📋</span> Submit Your Payment Details &amp; Pay
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-foreground">
            Full Name *
          </label>
          <Input
            required
            placeholder="Enter your full name"
            className={`bg-secondary/20 h-12 ${errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (errors.fullName)
                setErrors((prev) => ({ ...prev, fullName: "" }));
            }}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-foreground">
            Email Address *
          </label>
          <Input
            required
            type="email"
            placeholder="your@email.com"
            className={`bg-secondary/20 h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Playlist (read-only) */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-foreground">Playlist</label>
          <div className="relative">
            <select
              className="w-full h-12 px-3 rounded-md border border-input bg-secondary/20 text-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
              disabled
            >
              <option>
                {playlistName || "Standard Playlist"} — KES {price}
              </option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              ▼
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-foreground">
            M-Pesa Phone Number *
          </label>
          <Input
            required
            placeholder="0712345678 or 254712345678"
            className={`bg-secondary/20 h-12 font-mono ${errors.phoneNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            value={formData.phoneNumber}
            onChange={(e) => {
              setFormData({ ...formData, phoneNumber: e.target.value });
              if (errors.phoneNumber)
                setErrors((prev) => ({ ...prev, phoneNumber: "" }));
            }}
          />
          {errors.phoneNumber ? (
            <p className="text-xs text-red-500">{errors.phoneNumber}</p>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              Safaricom numbers only — format: 0712345678 or 254712345678
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        disabled={isProcessing}
      >
        Pay KES {price}
      </Button>
    </form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background border-primary/10">
        <div className="bg-secondary/30 p-8 text-center border-b border-primary/5">
          <DialogTitle className="text-2xl font-bold text-foreground mb-2">
            {paymentStatus === "success"
              ? "Payment Complete"
              : "Submit Payment Information"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {paymentStatus === "idle"
              ? "Complete payment and submit your details below"
              : paymentStatus === "success"
                ? `Your access to "${playlistName || "Standard Playlist"}" is now active.`
                : "M-Pesa STK push payment"}
          </DialogDescription>
        </div>

        {paymentStatus === "idle" ? renderForm() : renderStatusScreen()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
