import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CATEGORY_IMAGES, HERO_IMAGES, PRODUCTS, type Seller } from "@/lib/kala-data";
import { SellerOnboarding, BuyerOnboarding } from "@/components/kala/Onboarding";
import { BusinessCard, Logo } from "@/components/kala/BusinessCard";
import { SellersDirectory, SupportersDirectory } from "@/components/kala/Directories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kala Nari — Handmade by women makers near you" },
      { name: "description", content: "Discover nail art, crochet, resin, candles and more from verified local women artisans across India." },
      { property: "og:title", content: "Kala Nari — Handmade by women makers near you" },
      { property: "og:description", content: "Shop verified local women artisans across India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [sellerOpen, setSellerOpen] = useState(false);
  const [buyerOpen, setBuyerOpen] = useState(false);
  const [card, setCard] = useState<Seller | null>(null);

  return (
    <div className="min-h-screen">
      <header className="container-k flex items-center justify-between py-5">
        <Logo className="text-xl" />
        <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
          <a href="#categories">Categories</a><a href="#products">Shop</a>
          <a href="#sellers">Makers</a><a href="#supporters">Supporters</a>
          <Link to="/admin">HQ</Link>
        </nav>
      </header>

      <section className="container-k grid items-center gap-10 py-16 md:grid-cols-2">
        <div>
          <p className="eyebrow">Handmade · Hyperlocal · Women-led</p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mt-4">Every piece has a <em className="text-primary">maker</em> behind it.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-md">Kala Nari connects home-based women artisans with shoppers in their own city.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setSellerOpen(true)}>Join as an Artisan</Button>
            <Button size="lg" variant="outline" onClick={() => setBuyerOpen(true)}>Join as a Shopper</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={HERO_IMAGES[0]} alt="Handmade craft" className="h-72 w-full rounded-3xl object-cover shadow-warm" />
          <img src={HERO_IMAGES[1]} alt="Artisan at work" className="mt-12 h-72 w-full rounded-3xl object-cover shadow-warm" />
        </div>
      </section>

      <section id="categories" className="container-k py-16">
        <p className="eyebrow">Categories</p>
        <h2 className="font-display text-4xl mt-2 mb-8">Browse by craft</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <div key={c} className="group relative h-40 overflow-hidden rounded-2xl">
              <img src={CATEGORY_IMAGES[c]} alt={c} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-overlay" />
              <span className="absolute bottom-3 left-3 font-medium text-primary-foreground">{c}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="container-k py-16">
        <p className="eyebrow">Fresh from the studio</p>
        <h2 className="font-display text-4xl mt-2 mb-8">Trending pieces</h2>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <div key={p.id}>
              <img src={p.image} alt={p.name} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
              <p className="mt-3 font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.maker}</p>
              <p className="mt-1 font-semibold text-primary">₹{p.price.toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </section>

      <SellersDirectory onShowCard={setCard} />
      <SupportersDirectory />

      <footer className="container-k flex flex-wrap justify-between gap-4 py-10 text-sm text-muted-foreground">
        <Logo />
        <Link to="/admin">Kala Nari HQ →</Link>
      </footer>

      <SellerOnboarding open={sellerOpen} onOpenChange={setSellerOpen} onCreated={(s) => {
        setCard(s);
        document.getElementById("sellers")?.scrollIntoView({ behavior: "smooth" });
      }} />
      <BuyerOnboarding open={buyerOpen} onOpenChange={setBuyerOpen} />
      <BusinessCard seller={card} onOpenChange={(o) => !o && setCard(null)} />
    </div>
  );
}
