export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="simple-page">
      <p className="eyebrow">Get in touch</p>
      <h1>Contact the store.</h1>
      <p className="simple-lead">
        The contact number and operating area below were supplied for this draft.
        Confirm that they are the correct public business details before using this page for customers.
      </p>
      <div className="contact-card">
        <span className="eyebrow">Phone</span>
        <a href="tel:+917506072001">+91 75060 72001</a>
        <span className="eyebrow">Operating area</span>
        <strong>Meera-Bhayandar, Maharashtra</strong>
        <p>The exact business address and support email are still to be added.</p>
      </div>
    </section>
  );
}
