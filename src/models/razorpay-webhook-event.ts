import { Schema, model, models, type Model } from "mongoose";

export type RazorpayWebhookEventRecord = {
  eventId: string;
  eventType: string;
  processedAt: Date | null;
};

const eventSchema = new Schema<RazorpayWebhookEventRecord>(
  {
    eventId: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    processedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "razorpay_webhook_events",
  },
);

export const RazorpayWebhookEventModel =
  (models.RazorpayWebhookEvent as
    | Model<RazorpayWebhookEventRecord>
    | undefined) ??
  model<RazorpayWebhookEventRecord>(
    "RazorpayWebhookEvent",
    eventSchema,
  );
