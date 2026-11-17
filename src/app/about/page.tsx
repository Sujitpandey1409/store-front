export const metadata = { title: "About this store" };

export default function AboutPage() {
  return (
    <section className="simple-page">
      <p className="eyebrow">About Bharat Commerce</p>
      <h1>A store taking shape.</h1>
      <p className="simple-lead">
        Bharat Commerce is being built as an Indian multi-category store for clothing and accessories.
        This page is a draft while the real catalog, business details and customer policies are prepared.
      </p>
      <div className="simple-note">
        <strong>What is real in this preview?</strong>
        <p>The storefront layout, sample catalog browsing and browser-only cart. Sample products, photos and prices are for design and learning only.</p>
      </div>
    </section>
  );
}
