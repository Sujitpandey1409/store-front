import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";

loadEnvConfig(process.cwd());

async function seedSampleProducts() {
  const [{ connectToDatabase }, { ProductModel }, { sampleProducts }] = await Promise.all([
    import("../lib/db"),
    import("../models/product"),
    import("../lib/products"),
  ]);
  await connectToDatabase();

  for (const product of sampleProducts) {
    await ProductModel.updateOne(
      { slug: product.slug },
      {
        $setOnInsert: {
          name: product.name,
          slug: product.slug,
          category: product.category,
          description: product.description,
          image: product.image,
          imageAlt: product.imageAlt,
          sizes: product.sizes,
          pricePaise: product.price * 100,
          stock: 0,
          isSample: true,
          isActive: false,
        },
      },
      { upsert: true },
    );
  }

  console.info("Sample listings added where their slugs were unused. They remain inactive and cannot be purchased.");
}

seedSampleProducts()
  .catch((error: unknown) => {
    console.error("Sample catalog seed failed:", error instanceof Error ? error.message : "unknown error");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
