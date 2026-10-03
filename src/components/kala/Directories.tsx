import { useState } from "react";
import { BadgeCheck, MapPin, Settings2, Trash2, RotateCcw, IdCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type Seller, useSellers, useBuyers, initials } from "@/lib/kala-data";

function ManageBar({ on, setOn, onClear, onRestore, seedCount }: {
  on: boolean; setOn: (v: boolean) => void; onClear: () => void; onRestore: () => void; seedCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant={on ? "secondary" : "ghost"} onClick={() => setOn(!on)}>
        <Settings2 className="h-4 w-4" /> {on ? "Done" : "Manage Data"}
      </Button>
      {on && (
        <>
          <Button size="sm" variant="destructive" disabled={!seedCount} onClick={onClear}>
            <Trash2 className="h-4 w-4" /> Clear All Seed Data
          </Button>
          <Button size="sm" variant="ghost" onClick={onRestore}><RotateCcw className="h-4 w-4" /> Restore samples</Button>
        </>
      )}
    </div>
  );
}

export function SellersDirectory({ onShowCard }: { onShowCard: (s: Seller) => void }) {
  const { sellers, remove, clearSeed, restoreSeed } = useSellers();
  const [manage, setManage] = useState(false);
  const seed = sellers.filter((s) => !s.isUserAdded).length;
  return (
    <section id="sellers" className="container-k py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow">Verified Sellers Directory</p>
          <h2 className="font-display text-4xl mt-2">Meet the makers</h2>
        </div>
        <ManageBar on={manage} setOn={setManage} seedCount={seed}
          onClear={() => { clearSeed(); toast("Sample sellers removed"); }}
          onRestore={() => { restoreSeed(); toast("Sample sellers restored"); }} />
      </div>
      {sellers.length === 0 ? (
        <p className="text-muted-foreground">No sellers yet — be the first to join as an artisan.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sellers.map((s) => (
            <article key={s.id} className="group relative overflow-hidden rounded-2xl border bg-card shadow-soft">
              {s.image ? (
                <img src={s.image} alt={s.studio} loading="lazy" className="h-40 w-full object-cover" />
              ) : (
                <div className="grid h-40 place-items-center bg-card-hero font-display text-5xl text-primary-foreground">{initials(s.studio)}</div>
              )}
              {manage && (
                <button aria-label={`Delete ${s.studio}`} onClick={() => remove(s.id)}
                  className="absolute right-3 top-3 rounded-full bg-destructive p-2 text-destructive-foreground shadow">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              {s.isUserAdded && <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">New</span>}
              <div className="p-5">
                <p className="text-xs font-medium text-primary">{s.category}</p>
                <h3 className="font-display text-xl mt-1">{s.studio}</h3>
                <p className="text-sm text-muted-foreground">{s.name}</p>
                <p className="mt-3 text-sm line-clamp-2">{s.bio}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{s.location}</span>
                  <span className="inline-flex items-center gap-1 text-success"><BadgeCheck className="h-3.5 w-3.5" />{s.badge}</span>
                </div>
                {s.isUserAdded && (
                  <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => onShowCard(s)}>
                    <IdCard className="h-4 w-4" /> View business card
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function SupportersDirectory() {
  const { buyers, remove, clearSeed, restoreSeed } = useBuyers();
  const [manage, setManage] = useState(false);
  const seed = buyers.filter((b) => !b.isUserAdded).length;
  return (
    <section id="supporters" className="bg-secondary py-20">
      <div className="container-k">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow">Community Supporters</p>
            <h2 className="font-display text-4xl mt-2">The people buying local</h2>
          </div>
          <ManageBar on={manage} setOn={setManage} seedCount={seed}
            onClear={() => { clearSeed(); toast("Sample supporters removed"); }}
            onRestore={() => { restoreSeed(); toast("Sample supporters restored"); }} />
        </div>
        {buyers.length === 0 ? (
          <p className="text-muted-foreground">No supporters yet — join as a shopper.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {buyers.map((b) => (
              <div key={b.id} className="relative rounded-2xl border bg-card p-5 shadow-soft">
                {manage && (
                  <button aria-label={`Delete ${b.name}`} onClick={() => remove(b.id)}
                    className="absolute right-3 top-3 rounded-full bg-destructive p-1.5 text-destructive-foreground">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground font-semibold">{initials(b.name)}</span>
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.city} · {b.pincode}</p>
                  </div>
                </div>
                <p className={`mt-3 inline-flex items-center gap-1 text-xs ${b.isUserAdded ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  <BadgeCheck className="h-3.5 w-3.5" />{b.badge}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {b.categories.map((c) => <span key={c} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{c}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
