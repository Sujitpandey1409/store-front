import Link from "next/link";

export const metadata = { title: "Business and policy details" };

const detailsToConfirm = [
  "Exact legal and public business name",
  "Complete business address and a verified support email",
  "Final product catalog, accurate photos, sizes, stock and prices",
  "Shipping coverage, charges, delivery estimates and carrier",
  "Return, exchange, cancellation, refund and privacy policies",
  "Applicable tax and invoice details",
  "Payment account and approved live payment settings",
];

export default function StoreInfoPage() {
  return (
    <section className="simple-page store-info-page">
      <p className="eyebrow">Before opening the store</p>
      <h1>Details that need to be real.</h1>
      <p className="simple-lead">
        This page keeps unfinished business information visible during development.
        Do not present this preview as an operating shop until these details are confirmed and the order flow is connected.
      </p>
      <div className="requirements-card">
        <h2>Store launch checklist</h2>
        <ul>
          {detailsToConfirm.map((detail) => (
            <li key={detail}><span className="check-empty" aria-hidden="true" />{detail}</li>
          ))}
        </ul>
      </div>
      <p className="simple-footnote">
        The contact number and operating area on the <Link href="/contact">contact page</Link> are draft details supplied for this project.
        Confirm them before using them publicly.
      </p>
    </section>
  );
}
