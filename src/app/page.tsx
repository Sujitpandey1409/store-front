import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { getCatalogProducts } from "@/lib/catalog";
import { categories } from "@/lib/products";

const categoryPhotos = ["photo-1515886657613-9f3515b0c78f", "photo-1529139574466-a303027c1d8b", "photo-1584917865442-de89df76afd3", "photo-1542291026-7eec264c27ff"];
function photoUrl(photoId: string) { return "https://images.unsplash.com/" + photoId + "?auto=format&fit=crop&w=1000&q=85"; }

export default async function HomePage() {
  const products = await getCatalogProducts();
  const previewMode = products.length === 0 || products.some((product) => product.isSample);
  const visibleProducts = products.slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{previewMode ? "A new store, taking shape" : "The Bharat Commerce edit"}</p>
          <h1>Find your<br /><em>everyday</em> edit.</h1>
          <p className="hero-description">A considered mix of clothing and accessories, brought together for the way we live now.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/products">{previewMode ? "Explore the preview" : "Shop the collection"} <span aria-hidden="true">↗</span></Link>
            <span className="hero-caption">{previewMode ? "Sample collection · Not for sale" : "Explore the current collection"}</span>
          </div>
          <div className="hero-note"><span className="hero-note-number">01</span><span>Style for every day, with room to make it your own.</span></div>
        </div>
        <div className="hero-visual">
          <Image src={photoUrl("photo-1483985988355-763728e1935b")} alt="Fashion models walking together in a city" fill priority sizes="(max-width: 800px) 100vw, 52vw" />
          <div className="hero-image-caption"><span>BHARAT COMMERCE</span><span>{previewMode ? "STORE PREVIEW · 2026" : "THE COLLECTION"}</span></div>
          <span className="hero-stamp">BC</span>
        </div>
      </section>
      <section className="trust-strip" aria-label="Store information">
        <span>{previewMode ? "Sample catalog" : "Thoughtful everyday style"}</span><span aria-hidden="true">✳</span>
        <span>{previewMode ? "Local preview" : "Explore the collection"}</span><span aria-hidden="true">✳</span>
        <span>{previewMode ? "No orders or payments" : "Checkout setup required"}</span><span aria-hidden="true">✳</span>
        <span>Built to grow with you</span>
      </section>
      <section className="section-block category-section">
        <div className="section-heading">
          <div><p className="eyebrow">Browse by category</p><h2>Made for your mix.</h2></div>
          <Link className="text-link" href="/products">View the collection <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="category-grid grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link className="category-card" href={"/products?category=" + category} key={category}>
              <Image src={photoUrl(categoryPhotos[index])} alt={category + " collection"} fill sizes="(max-width: 640px) 50vw, 25vw" />
              <span className="category-overlay" /><span className="category-label"><span>{category}</span><span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section-block feature-section">
        <div className="section-heading">
          <div><p className="eyebrow">{previewMode ? "The sample edit" : "Selected pieces"}</p><h2>{previewMode ? "Pieces to start with." : "For your everyday."}</h2></div>
          <p className="section-aside">{previewMode ? "These listings are samples for the design preview. Replace them with verified products before opening the store." : "Explore the current collection. Product availability is checked again when checkout is enabled."}</p>
        </div>
        <ProductGrid items={visibleProducts} />
      </section>
      <section className="closing-banner">
        <p className="eyebrow">Bharat Commerce · {previewMode ? "Store preview" : "The collection"}</p>
        <h2>{previewMode ? "A good store starts with the details." : "Find pieces that feel like you."}</h2>
        <p>{previewMode ? "We are building the catalog and experience now. Business information, delivery and payment settings come next." : "Browse clothing and accessories for the rhythms of everyday life."}</p>
        <Link className="button button-light" href={previewMode ? "/store-info" : "/products"}>{previewMode ? "See what is needed" : "Shop the collection"} <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
