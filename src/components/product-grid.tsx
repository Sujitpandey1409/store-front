import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

export function ProductGrid({ items }: { items: Product[] }) {
  if (items.length === 0) return <p className="empty-results">No products match that search.</p>;
  return <div className="product-grid grid grid-cols-2 gap-x-3 gap-y-7 lg:grid-cols-4">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
