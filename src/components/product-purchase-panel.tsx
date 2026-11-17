"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [added, setAdded] = useState(false);
  const isSample = product.isSample;

  function addToBag() {
    addItem(product, size || null);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="purchase-panel">
      {product.sizes.length > 0 && (
        <label className="size-select">
          <span>{isSample ? "Choose a sample size" : "Choose a size"}</span>
          <select value={size} onChange={(event) => setSize(event.target.value)}>
            {product.sizes.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      )}
      {isSample ? (
        <button className="button button-dark button-wide" onClick={addToBag} type="button">
          {added ? "Added to preview bag" : "Add to preview bag"}<span aria-hidden="true">↗</span>
        </button>
      ) : (
        <button className={product.isAvailable ? "button button-dark button-wide" : "button button-disabled button-wide"} disabled={!product.isAvailable} onClick={addToBag} type="button">
          {!product.isAvailable ? "Currently unavailable" : added ? "Added to bag" : "Add to bag"}<span aria-hidden="true">↗</span>
        </button>
      )}
      <p className="purchase-note">{isSample ? "Sample listing only. It cannot be ordered or paid for." : "Checkout, delivery and return details are not enabled yet."}</p>
    </div>
  );
}
