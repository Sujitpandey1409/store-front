import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { getCatalogProductBySlug } from "@/lib/catalog";
import { formatPrice } from "@/lib/products";

type ProductPageProps = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) notFound();
  const isSample = product.isSample;

  return (
    <section className="product-detail-page">
      <div className="breadcrumbs">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href="/products">{isSample ? "Sample catalog" : "Shop"}</Link><span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </div>
      <div className="product-detail">
        <div className="detail-image">
          <Image src={product.image} alt={product.imageAlt} fill priority sizes="(max-width: 800px) 100vw, 55vw" />
          {isSample && <span className="sample-pill">Sample image</span>}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category}{isSample ? " · Sample item" : ""}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          <ProductPurchasePanel product={product} />
          <div className="detail-facts">
            <div><span>Listing status</span><strong>{isSample ? "Sample only" : product.isAvailable ? "Available" : "Unavailable"}</strong></div>
            <div><span>Order placement</span><strong>{isSample ? "Not available" : "Checkout setup required"}</strong></div>
          </div>
          {isSample && <Link className="text-link" href="/store-info">What needs to be ready before launch? <span aria-hidden="true">↗</span></Link>}
        </div>
      </div>
    </section>
  );
}
