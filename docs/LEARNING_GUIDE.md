# Learning guide

Read this project from the screen down to the data. Make one small change at a
time, run the preview, and follow each function to see where it is used.

## Folder map

    storefront/
    ├── src/
    │   ├── app/                    Pages and API routes (Next.js App Router)
    │   │   └── api/                 Server endpoints
    │   ├── components/             Reusable interactive and visual pieces
    │   ├── lib/                    Database, catalog, validation, payment helpers
    │   ├── models/                 MongoDB document shapes (Mongoose)
    │   └── scripts/                Local maintenance scripts
    ├── docs/                       Learning and setup notes
    ├── .env.example                Names of local settings, no secrets
    └── package.json                Scripts and dependencies

## Read these files in order

1. `src/app/layout.tsx`: shared page shell and browser cart provider.
2. `src/app/page.tsx`: home page composition.
3. `src/app/products/page.tsx` and `src/components/product-browser.tsx`: catalog
   data, search, filters and sort.
4. `src/app/products/[slug]/page.tsx`: one product page from its URL slug.
5. `src/components/cart-provider.tsx` and `src/components/cart-page.tsx`: local
   cart state and browser storage.
6. `src/lib/catalog.ts`: chooses the sample catalog or reads MongoDB.
7. `src/models/product.ts`, `src/models/order.ts`: the database record shapes.
8. `src/app/api/payments/create-order/route.ts`: validated server order creation.
9. `src/app/api/payments/verify/route.ts` and
   `src/app/api/webhooks/razorpay/route.ts`: payment verification and event flow.

## Follow an add-to-bag click

The product page renders `ProductPurchasePanel`. It calls `addItem` from
`CartProvider`. That provider keeps a small snapshot in this browser's local
storage so the preview bag still appears after a refresh. A browser cart is only a
convenience: checkout must always reload product prices and stock from MongoDB.

## Understand the server and browser boundary

Pages and route handlers run on the server by default. Components that need browser
state use `"use client"`. Keep MongoDB and Razorpay imports inside server-side
files. Route handlers are public endpoints, so they validate every field and
recalculate prices from the database instead of trusting the browser.

## Commands

    cd H:\storefront
    pnpm dev           # local preview
    pnpm typecheck     # TypeScript check
    pnpm build         # production build check
    pnpm db:seed       # insert sample database records, inactive and unpurchasable

## Small learning exercises

- Change a sample product title in `src/lib/products.ts`.
- Add a new category, then update the category model enum and filter.
- Add an optional product detail, such as fabric or care instructions.
- Read the create-order route and trace where it gets its payable amount.
- Add a product admin route only after learning authentication and authorization.

## Guardrails

The product collection seeds are examples. The bag is stored in one browser and
is not an order. Checkout is disabled by default. No live credentials are included.
