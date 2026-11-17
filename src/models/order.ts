import { Schema, model, models, type Model } from "mongoose";

export type OrderRecord = {
  customer: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    quantity: number;
    size: string | null;
    unitPricePaise: number;
  }>;
  subtotalPaise: number;
  shippingPaise: number;
  amountPaise: number;
  currency: "INR";
  status:
    | "pending"
    | "paid"
    | "payment_failed"
    | "cancelled"
    | "fulfilled"
    | "refunded";
  paymentStatus:
    | "pending"
    | "authorized"
    | "captured"
    | "failed"
    | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
};

const orderSchema = new Schema<OrderRecord>(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String, default: null },
        unitPricePaise: { type: Number, required: true, min: 1 },
      },
    ],
    subtotalPaise: { type: Number, required: true, min: 1 },
    shippingPaise: { type: Number, required: true, min: 0 },
    amountPaise: { type: Number, required: true, min: 1 },
    currency: { type: String, enum: ["INR"], required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "payment_failed",
        "cancelled",
        "fulfilled",
        "refunded",
      ],
      default: "pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "authorized", "captured", "failed", "refunded"],
      default: "pending",
      required: true,
    },
    razorpayOrderId: { type: String, unique: true, sparse: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
    collection: "orders",
  },
);

export const OrderModel =
  (models.Order as Model<OrderRecord> | undefined) ??
  model<OrderRecord>("Order", orderSchema);
