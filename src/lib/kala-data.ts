import { useCallback, useEffect, useState } from "react";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

// Every image below is used exactly once across categories, products and sellers.
const IMG = [
  "1604654894610-df63bc536371", "1610992015732-2449b76344bc", "1584992236310-6edddc08acff",
  "1513201099705-a9746e1e201f", "1603006905003-be475563bc59", "1515562141207-7a88fb7ce338",
  "1599643478518-a784e5dc4c8f", "1535632066927-ab7c9ab60908", "1596944924616-7b38e7cfac36",
  "1617038260897-41a1f14a8ca0", "1618220179428-22790b461013", "1513519245088-0e12902e5a38",
  "1540932239986-30128078f3c5", "1544441893-675973e31985", "1489987707025-afc232f7ea0f",
  "1620799140408-edc6dcb6d633", "1612196808214-b8e1d6145a8c", "1606760227091-3dd870d97f1d",
  "1597696929736-6d13bed8e6a8", "1607344645866-009c320b63e0", "1578500494198-246f612d3b3d",
  "1610701596007-11502861dcfa", "1565193566173-7a0ee3dbe261", "1586495777744-4413f21062fa",
].map(u);

export const HERO_IMAGES = [IMG[23], u("1600166898405-da9535204843")];

export const CATEGORIES = [
  "Nail Art", "Crochet", "Gift Hampers", "Candles", "Handmade Jewelry",
  "Customized Clothes", "Resin Art", "Bespoke Apparel", "Home Décor",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_IMAGES: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((c, i) => [c, IMG[i]]),
) as Record<Category, string>;

export type Product = { id: string; name: string; price: number; category: Category; maker: string; image: string };
export const PRODUCTS: Product[] = [
  { id: "p1", name: "Press-on Mehndi Nails", price: 649, category: "Nail Art", maker: "Glossy by Riya", image: IMG[9] },
  { id: "p2", name: "Crochet Tulip Bouquet", price: 899, category: "Crochet", maker: "Loops & Love", image: IMG[10] },
  { id: "p3", name: "Diwali Festive Hamper", price: 1499, category: "Gift Hampers", maker: "Tokri Tales", image: IMG[11] },
  { id: "p4", name: "Sandalwood Soy Candle", price: 450, category: "Candles", maker: "Diya Studio", image: IMG[12] },
  { id: "p5", name: "Oxidised Jhumka Pair", price: 399, category: "Handmade Jewelry", maker: "Chandni Crafts", image: IMG[13] },
  { id: "p6", name: "Hand-painted Denim Jacket", price: 2199, category: "Customized Clothes", maker: "Rang Rasiya", image: IMG[14] },
  { id: "p7", name: "Ocean Resin Coaster Set", price: 1199, category: "Resin Art", maker: "Neel Resin Co.", image: IMG[15] },
  { id: "p8", name: "Chikankari Kurta Set", price: 3499, category: "Bespoke Apparel", maker: "Sui Dhaaga", image: IMG[16] },
];

export type Seller = {
  id: string; name: string; studio: string; category: Category; location: string;
  phone: string; upi: string; bio: string; badge: string; image?: string; isUserAdded: boolean; createdAt: number;
};
export type Buyer = {
  id: string; name: string; city: string; pincode: string; categories: Category[];
  badge: string; isUserAdded: boolean; createdAt: number;
};

const sb = (i: number, name: string, studio: string, category: Category, location: string, bio: string): Seller => ({
  id: `seed-s${i}`, name, studio, category, location, phone: "", upi: "", bio,
  badge: "Verified Local Maker", image: IMG[17 + i], isUserAdded: false, createdAt: 0,
});
export const SEED_SELLERS: Seller[] = [
  sb(0, "Riya Desai", "Glossy by Riya", "Nail Art", "Vesu, Surat", "Bridal nail art inspired by mehndi patterns."),
  sb(1, "Meera Shah", "Loops & Love", "Crochet", "Adajan, Surat", "Crochet florals that never wilt."),
  sb(2, "Ananya Patel", "Diya Studio", "Candles", "Navrangpura, Ahmedabad", "Hand-poured soy candles with Indian scents."),
  sb(3, "Fatima Sheikh", "Neel Resin Co.", "Resin Art", "Bandra, Mumbai", "Ocean-themed resin pieces for your home."),
  sb(4, "Kavya Iyer", "Chandni Crafts", "Handmade Jewelry", "Indiranagar, Bengaluru", "Oxidised silver jewellery, made by hand."),
  sb(5, "Pooja Mehta", "Sui Dhaaga", "Bespoke Apparel", "Alkapuri, Vadodara", "Chikankari tailored to your measurements."),
];
const bb = (i: number, name: string, city: string, pincode: string, categories: Category[]): Buyer => ({
  id: `seed-b${i}`, name, city, pincode, categories, badge: "Community Supporter", isUserAdded: false, createdAt: 0,
});
export const SEED_BUYERS: Buyer[] = [
  bb(0, "Nisha Joshi", "Surat", "395007", ["Nail Art", "Candles"]),
  bb(1, "Aarav Kapoor", "Mumbai", "400050", ["Resin Art"]),
  bb(2, "Sneha Reddy", "Hyderabad", "500034", ["Crochet", "Home Décor"]),
  bb(3, "Ishita Gupta", "Delhi", "110017", ["Handmade Jewelry", "Gift Hampers"]),
];

function useStored<T>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(items));
  }, [items, ready, key]);
  // sync between components on the same page
  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d.key === key) setItems(d.items);
    };
    window.addEventListener("kala-store", h);
    return () => window.removeEventListener("kala-store", h);
  }, [key]);
  const update = useCallback((fn: (prev: T[]) => T[]) => {
    setItems((prev) => {
      const next = fn(prev);
      queueMicrotask(() => window.dispatchEvent(new CustomEvent("kala-store", { detail: { key, items: next } })));
      return next;
    });
  }, [key]);
  return [items, update] as const;
}

export function useSellers() {
  const [sellers, update] = useStored<Seller>("kala-nari:sellers", SEED_SELLERS);
  return {
    sellers,
    add: (s: Seller) => update((p) => [s, ...p]),
    remove: (id: string) => update((p) => p.filter((x) => x.id !== id)),
    clearSeed: () => update((p) => p.filter((x) => x.isUserAdded)),
    restoreSeed: () => update((p) => [...p.filter((x) => x.isUserAdded), ...SEED_SELLERS]),
  };
}
export function useBuyers() {
  const [buyers, update] = useStored<Buyer>("kala-nari:buyers", SEED_BUYERS);
  return {
    buyers,
    add: (b: Buyer) => update((p) => [b, ...p]),
    remove: (id: string) => update((p) => p.filter((x) => x.id !== id)),
    clearSeed: () => update((p) => p.filter((x) => x.isUserAdded)),
    restoreSeed: () => update((p) => [...p.filter((x) => x.isUserAdded), ...SEED_BUYERS]),
  };
}

export const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
