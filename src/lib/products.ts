export const categories = ["Women", "Men", "Accessories", "Footwear"] as const;
export type Category = (typeof categories)[number];
export type Product = {
  id: string; slug: string; name: string; category: Category; price: number;
  description: string; image: string; imageAlt: string; sizes: string[]; stock: number;
  isSample: boolean; isAvailable: boolean;
};
const sampleImage = (photoId: string) => "https://images.unsplash.com/" + photoId + "?auto=format&fit=crop&w=1100&q=85";

/** Design-only listings. They cannot be purchased or used to create a payment. */
export const sampleProducts: Product[] = [
  { id: "sample-women-linen-kurta", slug: "dawn-linen-kurta", name: "Dawn Linen Kurta", category: "Women", price: 1790, description: "A relaxed, easy-layering silhouette for warm days and slower weekends.", image: sampleImage("photo-1483985988355-763728e1935b"), imageAlt: "Woman wearing a relaxed neutral outfit", sizes: ["XS", "S", "M", "L", "XL"], stock: 0, isSample: true, isAvailable: false },
  { id: "sample-men-cotton-shirt", slug: "everyday-cotton-shirt", name: "Everyday Cotton Shirt", category: "Men", price: 1490, description: "A clean everyday shirt concept with a comfortable, casual shape.", image: sampleImage("photo-1529139574466-a303027c1d8b"), imageAlt: "Model wearing a contemporary casual outfit", sizes: ["S", "M", "L", "XL"], stock: 0, isSample: true, isAvailable: false },
  { id: "sample-accessory-crossbody", slug: "studio-crossbody", name: "Studio Crossbody", category: "Accessories", price: 1290, description: "A compact sample accessory designed to sit across the body.", image: sampleImage("photo-1584917865442-de89df76afd3"), imageAlt: "Structured fashion bag", sizes: [], stock: 0, isSample: true, isAvailable: false },
  { id: "sample-footwear-court-sneaker", slug: "weekend-court-sneaker", name: "Weekend Court Sneaker", category: "Footwear", price: 2490, description: "A versatile low-profile sneaker concept for everyday styling.", image: sampleImage("photo-1542291026-7eec264c27ff"), imageAlt: "Red athletic sneaker", sizes: ["6", "7", "8", "9", "10"], stock: 0, isSample: true, isAvailable: false },
  { id: "sample-women-knit-set", slug: "soft-knit-set", name: "Soft Knit Set", category: "Women", price: 2290, description: "An easy matching set concept with a relaxed fit and minimal feel.", image: sampleImage("photo-1515886657613-9f3515b0c78f"), imageAlt: "Model in a modern everyday outfit", sizes: ["XS", "S", "M", "L"], stock: 0, isSample: true, isAvailable: false },
  { id: "sample-men-overshirt", slug: "utility-overshirt", name: "Utility Overshirt", category: "Men", price: 1990, description: "A light outer-layer concept that works over a tee or simple shirt.", image: sampleImage("photo-1576566588028-4147f3842f27"), imageAlt: "Casual clothing from a sample fashion collection", sizes: ["S", "M", "L", "XL"], stock: 0, isSample: true, isAvailable: false },
  { id: "sample-accessory-shoulder-bag", slug: "arc-shoulder-bag", name: "Arc Shoulder Bag", category: "Accessories", price: 1690, description: "A sample shoulder bag with a simple shape for daily essentials.", image: sampleImage("photo-1490481651871-ab68de25d43d"), imageAlt: "Neutral fashion accessories and clothing", sizes: [], stock: 0, isSample: true, isAvailable: false },
  { id: "sample-footwear-runner", slug: "everyday-runner", name: "Everyday Runner", category: "Footwear", price: 2790, description: "A running-shoe concept included as a sample catalog item.", image: sampleImage("photo-1542291026-7eec264c27ff"), imageAlt: "Bright athletic shoe", sizes: ["6", "7", "8", "9", "10"], stock: 0, isSample: true, isAvailable: false },
];
export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}
