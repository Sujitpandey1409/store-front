"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/products";

export function CheckoutPreview() {
  const { items, subtotal, isReady } = useCart();

  if (!isReady) return <p className="cart-loading">Loading your bag…</p>;

  if (items.length === 0) {
    return (
      <div className="checkout-message">
        <h2>Your bag is empty.</h2>
        <Link className="text-link" href="/products">Browse the collection <span aria-hidden="true">↗</span></Link>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      <section className="checkout-message">
        <span className="eyebrow">Checkout preview</span>
        <h2>Orders are not enabled yet.</h2>
        <p>
          The server now has guarded order and payment routes, but this page is not
          connected to them. Checkout stays disabled by default, so this screen does
          not send your address or create an order.
        </p>
        <Link className="text-link" href="/store-info">See the details to complete <span aria-hidden="true">↗</span></Link>
      </section>
      <aside className="cart-summary">
        <p className="eyebrow">Bag summary</p>
        {items.map((item) => (
          <div className="summary-row" key={item.product.id + item.size}>
            <span>{item.product.name} × {item.quantity}{item.size ? " · " + item.size : ""}</span>
            <strong>{formatPrice(item.product.price * item.quantity)}</strong>
          </div>
        ))}
        <div className="summary-total"><span>Item subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
        <button className="button button-disabled button-wide" disabled>Checkout not enabled</button>
        <p className="purchase-note">No order or payment is created by this page.</p>
      </aside>
    </div>
  );
}
