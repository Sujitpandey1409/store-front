import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link className="product-image-wrap" href={"/products/" + product.slug} aria-label={"View " + product.name}>
        <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 25vw" />
        {product.isSample && <span className="sample-pill">Sample</span>}
        {!product.isSample && !product.isAvailable && <span className="sample-pill">Unavailable</span>}
      </Link>
      <div className="product-card-copy">
        <div><p className="eyebrow">{product.category}</p><Link className="product-name" href={"/products/" + product.slug}>{product.name}</Link></div>
        <span className="product-price">{formatPrice(product.price)}</span>
      </div>
      <Link className="product-card-link" href={"/products/" + product.slug}>View item <span aria-hidden="true">↗</span></Link>
    </article>
  );
}
