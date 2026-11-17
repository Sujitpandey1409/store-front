import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifyPaymentSchema } from "@/lib/checkout-schema";
import { getPaymentSettings, getRazorpayClient, hasDatabaseUri, isCheckoutEnabled, verifyCheckoutSignature } from "@/lib/razorpay";
import { OrderModel } from "@/models/order";

export const runtime = "nodejs";

function sameOrigin(request: NextRequest) {
  try {
    const originValue = request.headers.get("origin");
    if (!originValue) return false;
    const origin = new URL(originValue);
    const requestUrl = new URL(request.url);
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost ?? request.headers.get("host") ?? requestUrl.host;
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProtocol ?? requestUrl.protocol.slice(0, -1);
    return origin.host.toLowerCase() === host.toLowerCase() && origin.protocol === protocol + ":";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  if (!isCheckoutEnabled() || !hasDatabaseUri()) return NextResponse.json({ error: "Checkout is not configured for this store." }, { status: 503 });

  let payload: unknown;
  try {
    const body = await request.text();
    if (body.length > 8_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const parsed = verifyPaymentSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Payment details are incomplete." }, { status: 400 });
  const settings = getPaymentSettings();
  if (!settings || !verifyCheckoutSignature(parsed.data.razorpay_order_id, parsed.data.razorpay_payment_id, parsed.data.razorpay_signature, settings.keySecret)) {
    return NextResponse.json({ error: "Payment signature could not be verified." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const order = await OrderModel.findById(parsed.data.localOrderId).exec();
    if (!order || order.razorpayOrderId !== parsed.data.razorpay_order_id) {
      return NextResponse.json({ error: "The order could not be verified." }, { status: 404 });
    }
    if (order.paymentStatus === "captured") {
      return order.razorpayPaymentId === parsed.data.razorpay_payment_id
        ? NextResponse.json({ verified: true, paymentStatus: "captured" })
        : NextResponse.json({ error: "This order already has a confirmed payment." }, { status: 409 });
    }

    const payment = await getRazorpayClient().payments.fetch(parsed.data.razorpay_payment_id);
    if (payment.order_id !== order.razorpayOrderId || Number(payment.amount) !== order.amountPaise || payment.currency !== order.currency) {
      return NextResponse.json({ error: "Payment details do not match this order." }, { status: 400 });
    }

    if (payment.status === "captured") {
      const result = await OrderModel.updateOne(
        { _id: order._id, paymentStatus: { $ne: "captured" }, status: { $nin: ["refunded", "fulfilled"] } },
        { $set: { status: "paid", paymentStatus: "captured", razorpayPaymentId: payment.id } },
      );
      if (result.modifiedCount === 0) return NextResponse.json({ error: "The order status changed; check it before retrying." }, { status: 409 });
      return NextResponse.json({ verified: true, paymentStatus: "captured" });
    }

    if (payment.status === "authorized") {
      await OrderModel.updateOne(
        { _id: order._id, status: "pending", paymentStatus: "pending" },
        { $set: { paymentStatus: "authorized" } },
      );
      const latest = await OrderModel.findById(order._id).select("paymentStatus").lean().exec();
      return NextResponse.json({ verified: true, paymentStatus: latest?.paymentStatus ?? "authorized" });
    }

    return NextResponse.json({ verified: false, paymentStatus: payment.status });
  } catch {
    return NextResponse.json({ error: "Payment status could not be confirmed." }, { status: 503 });
  }
}
