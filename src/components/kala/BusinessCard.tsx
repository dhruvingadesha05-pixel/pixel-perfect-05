import { Printer, MapPin, BadgeCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Seller } from "@/lib/kala-data";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-semibold ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-sm">क</span>
      Kala Nari
    </span>
  );
}

export function BusinessCard({ seller, onOpenChange }: { seller: Seller | null; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={!!seller} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle className="font-display">Your Digital Business Card</DialogTitle>
          <DialogDescription>Share it on WhatsApp or print it for your stall.</DialogDescription>
        </DialogHeader>
        {seller && (
          <div id="business-card" className="relative overflow-hidden rounded-2xl bg-card-hero p-6 text-primary-foreground shadow-warm">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30" />
            <Logo className="relative" />
            <div className="relative mt-8">
              <p className="font-display text-3xl leading-tight">{seller.studio}</p>
              <p className="mt-1 opacity-90">{seller.name}</p>
            </div>
            <div className="relative mt-6 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-primary-foreground/15 px-3 py-1">{seller.category}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{seller.location}</span>
            </div>
            <div className="relative mt-4 flex items-center justify-between text-xs opacity-90">
              <span className="inline-flex items-center gap-1"><BadgeCheck className="h-4 w-4" />{seller.badge}</span>
              {seller.upi && <span>UPI: {seller.upi}</span>}
            </div>
          </div>
        )}
        <Button onClick={() => window.print()} variant="outline" className="print:hidden"><Printer className="h-4 w-4" /> Print card</Button>
      </DialogContent>
    </Dialog>
  );
}
