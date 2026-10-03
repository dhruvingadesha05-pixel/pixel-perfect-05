import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type Category, type Seller, type Buyer, useSellers, useBuyers } from "@/lib/kala-data";

const sellerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  studio: z.string().trim().min(2, "Enter your studio name").max(80),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: "Pick a category" }) }),
  location: z.string().trim().min(3, "Enter area & city").max(80),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{9,14}$/, "Enter a valid phone number"),
  upi: z.string().trim().regex(/^[\w.-]{2,}@[a-zA-Z]{2,}$/, "Enter a valid UPI ID (e.g. name@okaxis)"),
  bio: z.string().trim().min(10, "Tell us a little more (10+ chars)").max(400),
});

const buyerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  city: z.string().trim().min(2, "Enter your city").max(60),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  categories: z.array(z.enum(CATEGORIES)).min(1, "Pick at least one category"),
});

const Err = ({ m }: { m?: string | undefined }) => (m ? <p className="text-xs text-destructive mt-1">{m}</p> : null);

export function SellerOnboarding({ open, onOpenChange, onCreated }: {
  open: boolean; onOpenChange: (o: boolean) => void; onCreated: (s: Seller) => void;
}) {
  const { add } = useSellers();
  const empty = { name: "", studio: "", category: "", location: "", phone: "", upi: "", bio: "" };
  const [f, setF] = useState(empty);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = sellerSchema.safeParse(f);
    if (!r.success) {
      setErrs(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    const seller: Seller = {
      ...r.data, id: crypto.randomUUID(), badge: "Verified Local Maker", isUserAdded: true, createdAt: Date.now(),
    };
    add(seller);
    setF(empty); setErrs({});
    onOpenChange(false);
    onCreated(seller);
    toast.success("Welcome to Kala Nari! Your seller profile and digital business card are ready.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Join as an Artisan</DialogTitle>
          <DialogDescription>Set up your studio and get a digital business card instantly.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input value={f.name} onChange={set("name")} /><Err m={errs["name"]} /></div>
            <div><Label>Studio / Brand Name</Label><Input value={f.studio} onChange={set("studio")} /><Err m={errs["studio"]} /></div>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
              <SelectTrigger><SelectValue placeholder="Choose your craft" /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Err m={errs["category"]} />
          </div>
          <div><Label>Location / Area & City</Label><Input placeholder="Vesu, Surat" value={f.location} onChange={set("location")} /><Err m={errs["location"]} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Phone Number</Label><Input inputMode="tel" placeholder="98765 43210" value={f.phone} onChange={set("phone")} /><Err m={errs["phone"]} /></div>
            <div><Label>UPI ID</Label><Input placeholder="name@okaxis" value={f.upi} onChange={set("upi")} /><Err m={errs["upi"]} /></div>
          </div>
          <div><Label>Short Bio / Story</Label><Textarea rows={3} value={f.bio} onChange={set("bio")} /><Err m={errs["bio"]} /></div>
          <Button type="submit" size="lg">Create my studio</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BuyerOnboarding({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { add } = useBuyers();
  const [f, setF] = useState({ name: "", city: "", pincode: "", categories: [] as Category[] });
  const [errs, setErrs] = useState<Record<string, string>>({});

  const toggle = (c: Category) =>
    setF({ ...f, categories: f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c] });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = buyerSchema.safeParse(f);
    if (!r.success) {
      setErrs(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    const buyer: Buyer = {
      ...r.data, id: crypto.randomUUID(), badge: "Early Supporter - Verified Buyer", isUserAdded: true, createdAt: Date.now(),
    };
    add(buyer);
    setF({ name: "", city: "", pincode: "", categories: [] }); setErrs({});
    onOpenChange(false);
    toast.success("Welcome to Kala Nari! You are now registered as a supporter.");
    document.getElementById("supporters")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Join as a Shopper</DialogTitle>
          <DialogDescription>Support women makers near you.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <div><Label>Full Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /><Err m={errs["name"]} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>City</Label><Input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /><Err m={errs["city"]} /></div>
            <div><Label>Delivery Pincode</Label><Input inputMode="numeric" maxLength={6} value={f.pincode} onChange={(e) => setF({ ...f, pincode: e.target.value })} /><Err m={errs["pincode"]} /></div>
          </div>
          <div>
            <Label>Preferred Categories</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={f.categories.includes(c)} onCheckedChange={() => toggle(c)} /> {c}
                </label>
              ))}
            </div>
            <Err m={errs["categories"]} />
          </div>
          <Button type="submit" size="lg">Become a supporter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
