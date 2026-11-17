import { Schema, model, models, type Model } from "mongoose";
import type { Category } from "@/lib/products";

export type ProductRecord = {
  name: string;
  slug: string;
  category: Category;
  description: string;
  image: string;
  imageAlt: string;
  sizes: string[];
  pricePaise: number;
  stock: number;
  isSample: boolean;
  isActive: boolean;
};

const productSchema = new Schema<ProductRecord>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Women", "Men", "Accessories", "Footwear"],
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    image: { type: String, required: true },
    imageAlt: {
      type: String,
      required: true,
      maxlength: 300,
    },
    sizes: { type: [String], default: [] },
    pricePaise: { type: Number, required: true, min: 1 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isSample: { type: Boolean, required: true, default: true },
    isActive: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    collection: "products",
  },
);

productSchema.index({ isActive: 1, isSample: 1, category: 1 });

export const ProductModel =
  (models.Product as Model<ProductRecord> | undefined) ??
  model<ProductRecord>("Product", productSchema);
