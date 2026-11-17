import "server-only";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/db";
import { sampleProducts, type Product } from "@/lib/products";
import { ProductModel, type ProductRecord } from "@/models/product";

type CatalogRecord = ProductRecord & { _id: unknown };

function toProduct(record: CatalogRecord): Product {
  return {
    id: String(record._id),
    slug: record.slug,
    name: record.name,
    category: record.category,
    price: record.pricePaise / 100,
    description: record.description,
    image: record.image,
    imageAlt: record.imageAlt,
    sizes: record.sizes,
    stock: record.stock,
    isSample: record.isSample,
    isAvailable: record.isActive && !record.isSample && record.stock > 0,
  };
}

export async function getCatalogProducts(): Promise<Product[]> {
  if (!isDatabaseConfigured()) {
    return sampleProducts;
  }

  await connectToDatabase();

  const records = await ProductModel.find({
    isActive: true,
    isSample: false,
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  if (records.length === 0) {
    return sampleProducts;
  }

  return records.map((record) => toProduct(record as unknown as CatalogRecord));
}

export async function getCatalogProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  if (!isDatabaseConfigured()) {
    return sampleProducts.find((product) => product.slug === slug);
  }

  await connectToDatabase();

  const record = await ProductModel.findOne({
    slug,
    isActive: true,
    isSample: false,
  })
    .lean()
    .exec();

  return record
    ? toProduct(record as unknown as CatalogRecord)
    : sampleProducts.find((product) => product.slug === slug);

}
