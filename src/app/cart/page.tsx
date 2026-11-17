import { CartPage } from "@/components/cart-page";

export const metadata = { title: "Preview bag" };

export default function CartRoute() {
  return (
    <section className="cart-page">
      <div className="page-heading page-heading-small">
        <p className="eyebrow">Your selections</p><h1>Preview bag</h1>
        <p>Items are saved only in this browser and are not sent to a store.</p>
      </div>
      <CartPage />
    </section>
  );
}
