import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="wordmark wordmark-footer" href="/"><span className="wordmark-symbol">B</span><span><strong>Bharat</strong><small>COMMERCE</small></span></Link>
          <p>An original store project in progress. Sample listings are for the design preview and learning.</p>
        </div>
        <div className="footer-column"><h2>Explore</h2><Link href="/products">Shop all</Link><Link href="/about">About this store</Link><Link href="/contact">Contact</Link></div>
        <div className="footer-column"><h2>Store details</h2><Link href="/store-info">Business and policy details</Link><a href="tel:+917506072001">Call 75060 72001</a><span>Meera-Bhayandar, Maharashtra</span></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Bharat Commerce · Preview</span><span>Sample catalog · Checkout setup required</span></div>
    </footer>
  );
}
