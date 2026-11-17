"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/products";

export function CartPage() {
  const { items, itemCount, subtotal, isReady, changeQuantity, removeItem } = useCart();
  if (!isReady) return <p className="cart-loading">Loading your bag…</p>;
  const hasSamples = items.some((item) => item.product.isSample);

  if (items.length === 0) {
    return <section className="empty-cart"><span className="empty-cart-mark">B</span><p className="eyebrow">Your bag</p><h1>It is quiet in here.</h1><p>Explore the collection and add a piece you like.</p><Link className="button button-dark" href="/products">Browse the collection <span aria-hidden="true">↗</span></Link></section>;
  }

  return (
    <div className="cart-layout">
      <div className="cart-lines">
        {items.map((item) => (
          <article className="cart-line" key={item.product.id + item.size}>
            <Link className="cart-image" href={"/products/" + item.product.slug} aria-label={"View " + item.product.name}><Image src={item.product.image} alt={item.product.imageAlt} fill sizes="120px" /></Link>
            <div className="cart-line-info">
              <p className="eyebrow">{item.product.category}{item.product.isSample ? " · Sample" : ""}</p>
              <Link className="cart-product-name" href={"/products/" + item.product.slug}>{item.product.name}</Link>
              {item.size && <span>Size: {item.size}</span>}<span>{formatPrice(item.product.price)}</span>
            </div>
            <div className="quantity-control" aria-label={"Quantity of " + item.product.name}>
              <button aria-label="Decrease quantity" onClick={() => changeQuantity(item.product.id, item.size, item.quantity - 1)} type="button">−</button>
              <span>{item.quantity}</span>
              <button aria-label="Increase quantity" onClick={() => changeQuantity(item.product.id, item.size, item.quantity + 1)} type="button">+</button>
            </div>
            <button className="remove-link" onClick={() => removeItem(item.product.id, item.size)} type="button">Remove</button>
          </article>
        ))}
      </div>
      <aside className="cart-summary">
        <p className="eyebrow">{hasSamples ? "Preview summary" : "Bag summary"}</p><h2>Bag total</h2>
        <div className="summary-row"><span>Items ({itemCount})</span><strong>{formatPrice(subtotal)}</strong></div>
        <div className="summary-row"><span>Delivery and tax</span><span>Not calculated</span></div>
        <div className="summary-total"><span>{hasSamples ? "Sample subtotal" : "Item subtotal"}</span><strong>{formatPrice(subtotal)}</strong></div>
        <Link className="button button-dark button-wide" href="/checkout">Continue to checkout <span aria-hidden="true">↗</span></Link>
        <p className="purchase-note">{hasSamples ? "Sample items cannot be ordered. Delivery charges and taxes are not set up." : "Checkout setup is not complete, so no order or payment will be taken."}</p>
      </aside>
    </div>
  );
}
