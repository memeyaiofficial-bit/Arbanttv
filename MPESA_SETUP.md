# M-Pesa Daraja Integration — Setup Guide

## 1. Environment Variables

Create or update your `.env.local` (Next.js) / `.env` file:

```env
# From https://developer.safaricom.co.ke → My Apps → your app
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here

# Your Paybill number (or Till number for BuyGoods)
MPESA_SHORTCODE=174379

# Lipa Na M-Pesa Online Passkey (from the Developer Portal)
MPESA_PASSKEY=your_passkey_here

# Public HTTPS URL Safaricom will POST payment results to
# During development: use ngrok / Cloudflare Tunnel
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback

# "sandbox" during development, "production" for live
MPESA_ENV=sandbox
```

---

## 2. Next.js App Router File Structure

Wire up the three route handlers from `mpesa-api-routes.ts`:

```
app/
└── api/
    └── mpesa/
        ├── stkpush/
        │   └── route.ts      ← POST /api/mpesa/stkpush
        ├── callback/
        │   └── route.ts      ← POST /api/mpesa/callback
        └── status/
            └── route.ts      ← POST /api/mpesa/status
```

**app/api/mpesa/stkpush/route.ts**
```ts
import { POST_stkpush } from '@/lib/mpesa-api-routes';
export { POST_stkpush as POST };
```

**app/api/mpesa/callback/route.ts**
```ts
import { POST_callback } from '@/lib/mpesa-api-routes';
export { POST_callback as POST };
```

**app/api/mpesa/status/route.ts**
```ts
import { POST_status } from '@/lib/mpesa-api-routes';
export { POST_status as POST };
```

> If you're using **Express / Hono / Fastify**, call `POST_stkpush(req)` etc. inside your route handlers — just adapt the `NextRequest` → your framework's request object.

---

## 3. TransactionType

In `mpesa-api-routes.ts`, line `TransactionType`:

| Scenario | Value |
|---|---|
| Paybill (most common) | `CustomerPayBillOnline` |
| Till / BuyGoods | `CustomerBuyGoodsOnline` |

---

## 4. Local Development Callback

Safaricom needs to reach your `/api/mpesa/callback` endpoint. Use a tunnel:

```bash
# ngrok
npx ngrok http 3000
# → set MPESA_CALLBACK_URL=https://xxxx.ngrok.io/api/mpesa/callback

# Cloudflare Tunnel (free, no account needed)
npx cloudflared tunnel --url http://localhost:3000
```

---

## 5. Production Checklist

- [ ] Switch `MPESA_ENV=production`
- [ ] Use your live Shortcode & Passkey
- [ ] Callback URL is HTTPS with a valid certificate
- [ ] Replace the `paymentStore` Map with Redis or your DB
- [ ] Persist order records in the STK push handler
- [ ] Update order status in the callback handler
- [ ] Add request authentication / webhook signature verification
- [ ] Rate-limit the `/api/mpesa/stkpush` endpoint
- [ ] Log all Daraja request/response pairs for reconciliation

---

## 6. Daraja Sandbox Test Credentials

From the Safaricom Developer Portal sandbox:

| Field | Value |
|---|---|
| Shortcode | 174379 |
| Passkey | `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919` |
| Test phone | 254708374149 |
