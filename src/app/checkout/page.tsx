import { CheckoutPreview } from "@/components/checkout-preview";

export const metadata = { title: "Checkout preview" };

export default function CheckoutPage() {
  return (
    <section className="checkout-page">
      <div className="page-heading page-heading-small">
        <p className="eyebrow">A transparent preview</p><h1>Before checkout.</h1>
        <p>Order placement stays off until the store is ready to handle real customer details safely.</p>
      </div>
      <CheckoutPreview />
    </section>
  );
}
