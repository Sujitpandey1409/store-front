import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 · Not found</p>
      <h1>This page took a different turn.</h1>
      <p>The link may have changed. Browse the collection to find another item.</p>
      <Link className="button button-dark" href="/products">Browse the collection <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
