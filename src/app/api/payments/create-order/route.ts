import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { createOrderSchema } from "@/lib/checkout-schema";
import { getPaymentSettings, getRazorpayClient, hasDatabaseUri, isCheckoutEnabled, parseFlatShippingChargePaise } from "@/lib/razorpay";
import { OrderModel } from "@/models/order";
import { ProductModel } from "@/models/product";

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
  if (!isCheckoutEnabled() || !hasDatabaseUri() || !getPaymentSettings()) {
    return NextResponse.json({ error: "Checkout is not configured for this store." }, { status: 503 });
  }

  const shippingPaise = parseFlatShippingChargePaise();
  if (shippingPaise === null) {
    return NextResponse.json({ error: "A reviewed flat shipping charge must be configured before checkout." }, { status: 503 });
  }

  let payload: unknown;
  try {
    const body = await request.text();
    if (body.length > 32_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the customer details and cart items." }, { status: 400 });
  }

  const uniqueIds = [...new Set(parsed.data.items.map((item) => item.productId))];
  if (uniqueIds.some((id) => !isValidObjectId(id))) {
    return NextResponse.json({ error: "One or more products are no longer available." }, { status: 409 });
  }

  try {
    await connectToDatabase();
    const records = await ProductModel.find({
      _id: { $in: uniqueIds },
      isSample: false,
      isActive: true,
    }).lean().exec();
    const products = new Map(records.map((product) => [String(product._id), product]));
    if (products.size !== uniqueIds.length) {
      return NextResponse.json({ error: "One or more products are no longer available." }, { status: 409 });
    }

    const quantityByProduct = new Map<string, number>();
    for (const item of parsed.data.items) {
      const product = products.get(item.productId);
      if (!product || (item.size && !product.sizes.includes(item.size))) {
        return NextResponse.json({ error: "A selected product option is no longer available." }, { status: 409 });
      }
      quantityByProduct.set(item.productId, (quantityByProduct.get(item.productId) ?? 0) + item.quantity);
    }

    for (const [productId, quantity] of quantityByProduct) {
      const product = products.get(productId);
      if (!product || product.stock < quantity) {
        return NextResponse.json({ error: "The requested quantity is not currently in stock." }, { status: 409 });
      }
    }

    const items = parsed.data.items.map((item) => {
      const product = products.get(item.productId)!;
      return {
        productId: item.productId,
        name: product.name,
        slug: product.slug,
        quantity: item.quantity,
        size: item.size ?? null,
        unitPricePaise: product.pricePaise,
      };
    });
    const subtotalPaise = items.reduce((sum, item) => sum + item.unitPricePaise * item.quantity, 0);
    const amountPaise = subtotalPaise + shippingPaise;
    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
      return NextResponse.json({ error: "The order total is not valid." }, { status: 400 });
    }

    const localOrder = await OrderModel.create({
      customer: parsed.data.customer,
      items,
      subtotalPaise,
      shippingPaise,
      amountPaise,
      currency: "INR",
      status: "pending",
      paymentStatus: "pending",
    });

    try {
      const razorpayOrder = await getRazorpayClient().orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: String(localOrder._id),
        notes: { local_order_id: String(localOrder._id) },
      });
      await OrderModel.updateOne({ _id: localOrder._id }, { $set: { razorpayOrderId: razorpayOrder.id } });
      const settings = getPaymentSettings()!;
      return NextResponse.json({
        localOrderId: String(localOrder._id),
        keyId: settings.keyId,
        razorpayOrderId: razorpayOrder.id,
        amount: amountPaise,
        currency: "INR",
      }, { headers: { "Cache-Control": "no-store" } });
    } catch {
      await OrderModel.updateOne({ _id: localOrder._id }, { $set: { status: "payment_failed", paymentStatus: "failed" } });
      return NextResponse.json({ error: "Payment setup did not finish. Please try again." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "The order could not be prepared." }, { status: 503 });
  }
}
