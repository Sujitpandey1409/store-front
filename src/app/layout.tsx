import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Bharat Commerce | Store Preview", template: "%s | Bharat Commerce" },
  description: "A learning-friendly Indian ecommerce storefront. Sample listings are not available to order.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <CartProvider><SiteHeader /><main>{children}</main><SiteFooter /></CartProvider>
      </body>
    </html>
  );
}
