import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";

export function getPaymentSettings() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const mode = process.env.RAZORPAY_MODE;

  if (
    !keyId ||
    !keySecret ||
    !webhookSecret ||
    (mode !== "test" && mode !== "live")
  ) {
    return null;
  }

  if (mode === "test" && !keyId.startsWith("rzp_test_")) {
    return null;
  }

  if (mode === "live" && !keyId.startsWith("rzp_live_")) {
    return null;
  }

  return { keyId, keySecret, webhookSecret, mode };
}

export function isCheckoutEnabled() {
  return process.env.STORE_CHECKOUT_ENABLED === "true";
}

export function getRazorpayClient() {
  const settings = getPaymentSettings();

  if (!settings) {
    throw new Error(
      "Razorpay configuration is missing or does not match its selected mode.",
    );
  }

  return new Razorpay({
    key_id: settings.keyId,
    key_secret: settings.keySecret,
  });
}

export function verifyCheckoutSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
) {
  const expected = createHmac("sha256", secret)
    .update(orderId + "|" + paymentId)
    .digest();
  const received = Buffer.from(signature, "hex");

  return (
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
}

export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string,
) {
  const expected = createHmac("sha256", secret)
    .update(body)
    .digest();
  const received = Buffer.from(signature, "hex");

  return (
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
}

export function parseFlatShippingChargePaise() {
  const value = process.env.STORE_FLAT_SHIPPING_CHARGE_PAISE;

  if (value === undefined || !/^\d+$/.test(value)) {
    return null;
  }

  const amount = Number(value);
  return Number.isSafeInteger(amount) ? amount : null;
}

export function hasDatabaseUri() {
  return Boolean(process.env.DATABASE_URI);
}
