import { createFileRoute, Link } from "@tanstack/react-router";
import { IndianRupee, Package, Users, Palette, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSellers, useBuyers } from "@/lib/kala-data";
import { Logo } from "@/components/kala/BusinessCard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Kala Nari HQ — Admin dashboard" },
      { name: "description", content: "GMV, orders, makers, supporters and unit economics for Kala Nari." },
      { property: "og:title", content: "Kala Nari HQ — Admin dashboard" },
      { property: "og:description", content: "Platform metrics and unit economics for Kala Nari." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const inr = (n: number) => (n < 0 ? "−₹" : "₹") + Math.abs(Math.round(n)).toLocaleString("en-IN");

const WEEKLY = [
  { w: "W1", orders: 182 }, { w: "W2", orders: 214 }, { w: "W3", orders: 241 }, { w: "W4", orders: 268 },
  { w: "W5", orders: 305 }, { w: "W6", orders: 342 }, { w: "W7", orders: 377 }, { w: "W8", orders: 421 },
];
const CATS = [
  { c: "Resin", share: 24 }, { c: "Crochet", share: 19 }, { c: "Nails", share: 17 },
  { c: "Jewelry", share: 15 }, { c: "Candles", share: 10 }, { c: "Hampers", share: 8 }, { c: "Apparel", share: 7 },
];
const ordersCfg = { orders: { label: "Orders", color: "var(--primary)" } } satisfies ChartConfig;
const catCfg = { share: { label: "Share %", color: "var(--accent)" } } satisfies ChartConfig;

function Admin() {
  const { sellers } = useSellers();
  const { buyers } = useBuyers();

  const monthlyOrders = 1420;
  const aov = 1150;
  const gmv = monthlyOrders * aov;
  const takeRate = gmv * 0.06;
  const subs = sellers.length * 199;
  const revenue = takeRate + subs;

  const expenses = [
    { item: "AWS / Vercel Cloud Infrastructure", amt: 18000 },
    { item: "Razorpay Escrow Transaction Fees (1.8% of GMV)", amt: gmv * 0.018 },
    { item: "3PL Courier API Overhead (Shiprocket / Porter)", amt: monthlyOrders * 12 },
    { item: "Tech Maintenance & Development", amt: 45000 },
  ];
  const totalExp = expenses.reduce((a, e) => a + e.amt, 0);
  const net = revenue - totalExp;
  const cash = 1500000;
  const runway = net >= 0 ? "Profitable" : `${(cash / -net).toFixed(1)} months`;

  const kpis = [
    { label: "Total Monthly GMV", value: inr(gmv), icon: IndianRupee, sub: `${monthlyOrders} orders × ${inr(aov)} AOV` },
    { label: "Daily Orders / Pending", value: `${Math.round(monthlyOrders / 30)} / 18`, icon: Package, sub: "Pending deliveries today" },
    { label: "Registered Artisans", value: sellers.length, icon: Palette, sub: `${sellers.filter((s) => s.isUserAdded).length} genuine sign-ups` },
    { label: "Genuine Supporters", value: buyers.length, icon: Users, sub: `${buyers.filter((b) => b.isUserAdded).length} genuine sign-ups` },
    { label: "Platform Revenue", value: inr(revenue), icon: TrendingUp, sub: "6% take rate + ₹199/mo subscriptions" },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <header className="container-k flex items-center justify-between py-5">
        <Logo className="text-xl" />
        <Link to="/" className="text-sm text-muted-foreground">← Back to marketplace</Link>
      </header>
      <main className="container-k pb-16">
        <p className="eyebrow">Kala Nari HQ</p>
        <h1 className="font-display text-4xl mt-2 mb-8">Admin View</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                {k.label}<k.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="font-display text-3xl mt-3">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 mt-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 className="font-medium mb-4">Weekly order volume</h2>
            <ChartContainer config={ordersCfg} className="h-64 w-full">
              <AreaChart data={WEEKLY}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="w" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="orders" type="monotone" stroke="var(--color-orders)" fill="var(--color-orders)" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 className="font-medium mb-4">Category breakdown (% of orders)</h2>
            <ChartContainer config={catCfg} className="h-64 w-full">
              <BarChart data={CATS}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="c" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="share" fill="var(--color-share)" radius={6} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="font-medium mb-4">Tech & operational expenses (monthly)</h2>
          <Table>
            <TableHeader><TableRow><TableHead>Line item</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.item}><TableCell>{e.item}</TableCell><TableCell className="text-right">{inr(e.amt)}</TableCell></TableRow>
              ))}
              <TableRow className="font-medium"><TableCell>Total expenses</TableCell><TableCell className="text-right">{inr(totalExp)}</TableCell></TableRow>
              <TableRow><TableCell>Platform revenue</TableCell><TableCell className="text-right">{inr(revenue)}</TableCell></TableRow>
              <TableRow className="font-semibold">
                <TableCell>Net profit / (burn)</TableCell>
                <TableCell className={`text-right ${net >= 0 ? "text-success" : "text-destructive"}`}>{inr(net)}</TableCell>
              </TableRow>
              <TableRow><TableCell>Runway (on {inr(cash)} cash)</TableCell><TableCell className="text-right">{runway}</TableCell></TableRow>
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
