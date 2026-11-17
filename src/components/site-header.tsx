"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

function BagIcon() {
  return <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 8.5h14l-1 12H6l-1-12Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>;
}

export function SiteHeader() {
  const { itemCount, isReady } = useCart();
  return (
    <>
      <div className="preview-bar">Bharat Commerce <span aria-hidden="true">·</span> Store preview <span aria-hidden="true">·</span> Checkout setup required</div>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Bharat Commerce home">
          <span className="wordmark-symbol">B</span><span><strong>Bharat</strong><small>COMMERCE</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/products">Shop all</Link><Link href="/products?category=Women">Women</Link>
          <Link href="/products?category=Men">Men</Link><Link href="/products?category=Accessories">Accessories</Link>
          <Link href="/products?category=Footwear">Footwear</Link>
        </nav>
        <div className="header-actions">
          <Link className="search-link" href="/products">Search</Link>
          <Link className="bag-link" href="/cart" aria-label={"Open bag, " + (isReady ? itemCount : "loading") + " items"}>
            <BagIcon /><span>Bag</span><span className="bag-count">{isReady ? itemCount : "—"}</span>
          </Link>
        </div>
      </header>
    </>
  );
}
