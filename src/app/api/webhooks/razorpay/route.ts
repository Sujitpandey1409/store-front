import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getPaymentSettings, hasDatabaseUri, verifyWebhookSignature } from "@/lib/razorpay";
import { OrderModel } from "@/models/order";
import { RazorpayWebhookEventModel } from "@/models/razorpay-webhook-event";

export const runtime = "nodejs";

type PaymentWebhook = {
  event?: unknown;
  payload?: { payment?: { entity?: { id?: unknown; order_id?: unknown; amount?: unknown; currency?: unknown; status?: unknown } } };
};

export async function POST(request: NextRequest) {
  const settings = getPaymentSettings();
  const signature = request.headers.get("x-razorpay-signature");
  const eventId = request.headers.get("x-razorpay-event-id");
  if (!settings || !hasDatabaseUri() || !signature || !eventId || eventId.length > 160) {
    return NextResponse.json({ error: "Webhook configuration or headers are incomplete." }, { status: 400 });
  }

  let rawBody: string;
  try { rawBody = await request.text(); }
  catch { return NextResponse.json({ error: "Could not read the webhook body." }, { status: 400 }); }
  if (rawBody.length > 1_000_000) return NextResponse.json({ error: "Webhook body is too large." }, { status: 413 });
  if (!verifyWebhookSignature(rawBody, signature, settings.webhookSecret)) {
    return NextResponse.json({ error: "Webhook signature is invalid." }, { status: 400 });
  }

  let body: PaymentWebhook;
  try { body = JSON.parse(rawBody) as PaymentWebhook; }
  catch { return NextResponse.json({ error: "Webhook body is invalid JSON." }, { status: 400 }); }
  if (typeof body.event !== "string") return NextResponse.json({ error: "Webhook event type is missing." }, { status: 400 });

  try {
    await connectToDatabase();
    let eventRecord = await RazorpayWebhookEventModel.findOne({ eventId }).exec();
    if (eventRecord?.processedAt) return NextResponse.json({ received: true, duplicate: true });
    if (!eventRecord) {
      try {
        eventRecord = await RazorpayWebhookEventModel.create({ eventId, eventType: body.event, processedAt: null });
      } catch (error) {
        if ((error as { code?: number }).code !== 11000) throw error;
        eventRecord = await RazorpayWebhookEventModel.findOne({ eventId }).exec();
        if (eventRecord?.processedAt) return NextResponse.json({ received: true, duplicate: true });
      }
    }

    const entity = body.payload?.payment?.entity;
    if (body.event === "payment.captured" || body.event === "payment.authorized" || body.event === "payment.failed") {
      const expectedStatus = body.event === "payment.captured" ? "captured" : body.event === "payment.authorized" ? "authorized" : "failed";
      if (!entity || typeof entity.order_id !== "string" || typeof entity.id !== "string" ||
        typeof entity.amount !== "number" || typeof entity.currency !== "string" || entity.status !== expectedStatus) {
        return NextResponse.json({ error: "Payment event data is incomplete or inconsistent." }, { status: 400 });
      }
      const order = await OrderModel.findOne({ razorpayOrderId: entity.order_id }).exec();
      if (!order) return NextResponse.json({ error: "Local order was not found." }, { status: 404 });
      if (entity.amount !== order.amountPaise || entity.currency !== order.currency) {
        return NextResponse.json({ error: "Payment amount does not match the local order." }, { status: 400 });
      }

      if (body.event === "payment.captured") {
        await OrderModel.updateOne(
          { _id: order._id, paymentStatus: { $ne: "captured" }, status: { $nin: ["refunded", "fulfilled"] } },
          { $set: { status: "paid", paymentStatus: "captured", razorpayPaymentId: entity.id } },
        );
      } else if (body.event === "payment.authorized" && order.paymentStatus === "pending") {
        await OrderModel.updateOne({ _id: order._id, status: "pending", paymentStatus: "pending" }, { $set: { paymentStatus: "authorized" } });
      } else if (body.event === "payment.failed" && !["captured", "refunded"].includes(order.paymentStatus)) {
        await OrderModel.updateOne({ _id: order._id, status: { $nin: ["paid", "refunded", "fulfilled"] } }, { $set: { status: "payment_failed", paymentStatus: "failed" } });
      }
    }

    await RazorpayWebhookEventModel.updateOne({ eventId }, { $set: { processedAt: new Date() } });
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook could not be processed." }, { status: 503 });
  }
}
