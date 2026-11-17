# Razorpay integration notes

This is a guarded server foundation. It does not start a transaction by itself.

## Local settings

Copy `.env.example` to `.env.local`, then set credentials from your own Razorpay
dashboard. Use test keys first; the key ID must start with `rzp_test_` when
`RAZORPAY_MODE=test`. Configure the test webhook secret separately. Keep the
key secret and webhook secret private. Do not use a `NEXT_PUBLIC_` variable for
either secret.

Leave `STORE_CHECKOUT_ENABLED=false`. The catalog seed contains samples only;
the order API rejects sample, inactive and out-of-stock products. The shipping
charge must be explicitly set in paise before checkout can be enabled.

## Flow to learn

- Create the Razorpay order on the server, from server-side database prices.
- Pass only the public key ID and provider order ID into the future checkout UI.
- Verify the checkout callback HMAC on the server. Then fetch the payment and check
  the provider order ID, amount, currency and state.
- Configure a webhook for `/api/webhooks/razorpay`. The endpoint validates the
  signature using the exact raw request body and uses the provider event ID for
  repeat delivery.

Webhook configuration must use the same secret configured in
`RAZORPAY_WEBHOOK_SECRET`. Test webhook delivery against a reachable HTTPS
environment you control; do not publish this local project or expose secrets
without a separate decision.

## Before live use

First connect and review the browser checkout, customer consent and privacy
disclosures, inventory reservation/expiry, order status screens, support and refund
operations, shipping and tax settings. Then use Razorpay's live key pair only after
the account itself is approved and live operations have been reviewed. No bank,
merchant eligibility, or verification outcome is guaranteed by this code.
