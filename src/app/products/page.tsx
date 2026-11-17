import { ProductBrowser } from "@/components/product-browser";
import { getCatalogProducts } from "@/lib/catalog";

type ProductsPageProps = { searchParams: Promise<{ category?: string }> };
export const metadata = { title: "Shop the collection" };

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [{ category }, products] = await Promise.all([searchParams, getCatalogProducts()]);
  const hasSamples = products.some((product) => product.isSample);
  return (
    <section className="catalog-page">
      <div className="page-heading">
        <p className="eyebrow">{hasSamples ? "Sample catalog · Preview only" : "The collection"}</p>
        <h1>Find your next favourite.</h1>
        <p>{hasSamples ? "Explore the sample collection. These listings are placeholders and cannot be ordered." : "Explore the current collection and find a piece for your everyday."}</p>
      </div>
      <ProductBrowser initialCategory={category} products={products} />
    </section>
  );
}
