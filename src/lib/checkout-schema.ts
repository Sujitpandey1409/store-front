import { z } from "zod";

const nonEmptyText = (max: number) =>
  z.string().trim().min(1).max(max);

export const createOrderSchema = z
  .object({
    customer: z
      .object({
        name: nonEmptyText(100),
        email: z.email().max(254),
        phone: z
          .string()
          .trim()
          .regex(
            /^(?:\+91[\s-]?)?[6-9]\d{9}$/,
            "Enter a valid Indian mobile number.",
          ),
        addressLine1: nonEmptyText(180),
        addressLine2: z.string().trim().max(180).optional().default(""),
        city: nonEmptyText(100),
        state: nonEmptyText(100),
        postalCode: z
          .string()
          .trim()
          .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code."),
      })
      .strict(),
    items: z
      .array(
        z
          .object({
            productId: z.string().min(1).max(64),
            quantity: z.number().int().min(1).max(5),
            size: z.string().trim().max(32).nullable().optional().default(null),
          })
          .strict(),
      )
      .min(1)
      .max(20),
  })
  .strict();

export const verifyPaymentSchema = z
  .object({
    localOrderId: z.string().regex(/^[a-f\d]{24}$/i),
    razorpay_order_id: z.string().min(5).max(80),
    razorpay_payment_id: z.string().min(5).max(80),
    razorpay_signature: z.string().regex(/^[a-f\d]{64}$/i),
  })
  .strict();
