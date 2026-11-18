"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { categories, type Product } from "@/lib/products";

export function ProductBrowser({ initialCategory, products }: { initialCategory?: string; products: Product[] }) {
  const chosenCategory = categories.find((category) => category === initialCategory);
  const [category, setCategory] = useState<string>(chosenCategory ?? "All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setCategory(chosenCategory ?? "All");
  }, [chosenCategory]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
    if (sort === "price-low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, products, search, sort]);

  const hasSamples = visibleProducts.some((product) => product.isSample);

  return (
    <>
      <div className="catalog-tools">
        <label className="search-field">
          <span className="sr-only">Search products</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.3 4.3" />
          </svg>
          <input type="search" placeholder="Search the collection" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <label className="sort-field">
          <span>Sort by</span>
          <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
        <div className="filter-row" aria-label="Filter by category">
          {["All", ...categories].map((name) => (
            <button aria-pressed={category === name} className={category === name ? "filter-chip is-active" : "filter-chip"} key={name} onClick={() => setCategory(name)} type="button">{name}</button>
          ))}
        </div>
      </div>
      <div className="catalog-result-line">
        <span>{visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}</span>
        <span>{hasSamples ? "Sample listings · Not available to order" : "A considered edit for everyday"} </span>
      </div>
      <ProductGrid items={visibleProducts} />
    </>
  );
}
