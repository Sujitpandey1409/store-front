# How the store is put together

## Stack

- Next.js App Router + React for pages, layouts and server endpoints.
- TypeScript for page, product and API shapes.
- Tailwind CSS for responsive utility layout; `src/app/globals.css` holds the
  brand palette and reusable store styling.
- MongoDB + Mongoose for products, order snapshots and webhook event IDs.
- Zod for request validation.
- Razorpay's Node SDK and Node crypto for payment order creation and HMAC checks.

## Data path

With no `DATABASE_URI`, server pages read the design samples in
`src/lib/products.ts`. When a database URI exists, `src/lib/catalog.ts` reads
active, non-sample records from MongoDB. The sample seed script uses
`$setOnInsert`: it does not overwrite an existing slug, and it sets
`isSample=true`, `isActive=false`, and `stock=0`.

The browser bag holds product snapshots for display only. When a checkout request
is accepted, the server ignores the browser's displayed prices and reloads the
product, price, status, size and stock from MongoDB. Amounts are stored in integer
paise. The database product price must be the final customer-facing per-item price
(including applicable tax treatment decided by the business).

## Payment path (not yet connected to a checkout button)

1. Browser checkout should send customer details and product IDs/quantities to
   `POST /api/payments/create-order`.
2. The route validates the request, checks active real listings, checks available
   stock, calculates product and configured flat-shipping amounts, stores a pending
   local order, then asks Razorpay to create its order.
3. A browser checkout would receive the public key ID and Razorpay order ID. The
   key secret never leaves the server.
4. On callback, `POST /api/payments/verify` checks the HMAC signature, then asks
   Razorpay for the payment and compares its order ID, amount and currency.
5. Razorpay's signed webhook is the durable status update path. The route validates
   the untouched raw body, records the provider event ID, and handles duplicate or
   out-of-order payment events without changing a captured payment back to failed.

## Current production gaps

This foundation does not yet reserve stock while a customer is paying, expire and
release abandoned orders, authenticate store staff, provide product/order
management, apply destination-based shipping or tax rules, send invoices or
notifications, process refunds, or provide abuse throttling. The browser payment
widget and success/failure screens are also not connected. Those pieces must be
implemented and operated before accepting real customers or payments.
