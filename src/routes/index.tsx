import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sprout,
  TrendingUp,
  ShieldCheck,
  CloudRain,
  Sun,
  CloudDrizzle,
  Cloud,
  FileText,
  Brain,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Layers,
  Network,
  Banknote,
  Leaf,
  BarChart3,
  Wallet,
  Database,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeGraph } from "@/components/mavuno/KnowledgeGraph";
import logoAsset from "@/assets/mavuno-logo.png";
import heroFarmer from "@/assets/farmer-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mavuno - AI-Powered Credit Readiness for Smallholder Farmers" },
      { name: "description", content: "Mavuno helps farmers build trusted farm records, understand their credit readiness, and access finance more easily." },
      { property: "og:title", content: "Mavuno - AI Credit Readiness & Farm Risk Profiling" },
      { property: "og:description", content: "Turning farm records into financial opportunity for smallholder farmers and lenders." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <PrototypeSection />
      <Impact />
      <FutureVision />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3">
        <a href="#top" className="flex items-center gap-2">
          <img src={logoAsset} alt="Mavuno logo" className="h-9 w-9 object-contain" />
          <span className="font-bold text-lg tracking-tight text-primary">mavuno</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#problem" className="hover:text-foreground">Problem</a>
          <a href="#solution" className="hover:text-foreground">Solution</a>
          <a href="#prototype" className="hover:text-foreground">Demo</a>
          <a href="#impact" className="hover:text-foreground">Impact</a>
          <a href="#vision" className="hover:text-foreground">Roadmap</a>
        </nav>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
          <a href="#prototype">Explore Demo</a>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-[0.08]" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Badge variant="secondary" className="bg-accent text-accent-foreground border-0 mb-5">
            <Leaf className="h-3.5 w-3.5 mr-1.5" /> Mercy Corps AgriFin · Phase 2 Prototype
          </Badge>

          {/* Grow Trust. Unlock Finance. */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            Grow Trust. <br></br>
            <span className="text-primary">Unlock Finance.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Mavuno helps farmers build trusted farm records, understand their credit readiness, and access finance with confidence
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-soft)]">
              <a href="#prototype">Explore Demo <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
              <a href="#solution">Farmer Journey</a>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: "78/100", l: "Credit Score" },
              { v: "2.4 ac", l: "Farms Profiled" },
              { v: "$430", l: "Verified Revenue" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-primary">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-30" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-elegant)] border bg-card">
            <img src={heroFarmer} alt="Smallholder farmer in Rwanda holding a smartphone showing the Mavuno dashboard" className="w-full h-auto" />
          </div>
          <FloatingCard className="left-4 top-8" tone="primary" icon={<TrendingUp className="h-4 w-4" />} title="Credit Score" value="78 / 100" />
          <FloatingCard className="right-4 top-1/3" tone="gold" icon={<CloudRain className="h-4 w-4" />} title="Weather Alert" value="Heavy rain, Day 2" />
          <FloatingCard className="left-6 bottom-8" tone="primary" icon={<ShieldCheck className="h-4 w-4" />} title="Finance Ready" value="Good standing" />
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  className,
  icon,
  title,
  value,
  tone,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  tone: "primary" | "gold";
}) {
  return (
    <div className={`hidden md:flex absolute ${className ?? ""} items-center gap-3 rounded-xl border bg-card/95 backdrop-blur px-3.5 py-2.5 shadow-[var(--shadow-soft)] animate-in fade-in slide-in-from-bottom-2`}>
      <div className={`h-8 w-8 rounded-lg grid place-items-center ${tone === "primary" ? "bg-primary text-primary-foreground" : "bg-gold text-gold-foreground"}`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {eyebrow && <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">{eyebrow}</div>}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Problem() {
  const items = [
    { icon: FileText, title: "No Trusted Records", body: "Farmers often lack documented farm history that lenders can verify." },
    { icon: Users, title: "Limited Lender Visibility", body: "Lenders cannot easily assess on-farm performance and reliability." },
    { icon: CloudRain, title: "Climate Risk", body: "Weather uncertainty quietly erodes productivity and repayment capacity." },
    { icon: Wallet, title: "Missed Opportunities", body: "Farmers miss access to quality inputs, insurance, and growth capital." },
  ];
  return (
    <section id="problem" className="py-20 bg-muted/30 border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="The Problem" title="Why farmers struggle to access finance" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it) => (
            <Card key={it.title} className="border bg-card hover:shadow-[var(--shadow-soft)] transition-shadow">
              <CardContent className="pt-6">
                <div className="h-11 w-11 rounded-xl bg-accent text-primary grid place-items-center mb-4">
                  <it.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1.5">{it.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{it.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const steps = [
    { icon: FileText, title: "Record", body: "Farmers record activities, production, sales, and expenses through simple mobile-first inputs." },
    { icon: Brain, title: "Analyze", body: "AI combines farm records with weather signals and soil indicators to model performance and risk." },
    { icon: ShieldCheck, title: "Build Trust", body: "Generate a Credit Readiness Profile lenders can understand and act on in minutes." },
  ];
  return (
    <section id="solution" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="The Solution" title="How Mavuno works" subtitle="A three-step journey from farm activity to finance opportunity." />
        <div className="grid md:grid-cols-3 gap-5 relative">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <Card className="border-2 border-transparent hover:border-primary/20 transition-all bg-gradient-to-b from-card to-accent/30">
                <CardContent className="pt-7 pb-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-soft)]">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Step {i + 1}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </CardContent>
              </Card>
              {i < 2 && (
                <ArrowRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== PROTOTYPE TABS ========== */

function PrototypeSection() {
  return (
    <section id="prototype" className="py-20 bg-gradient-to-b from-muted/30 to-background border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Interactive Prototype" title="Experience Mavuno end-to-end" subtitle="Switch between the farmer view, AI engine, risk signals, and the lender dashboard." />
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto bg-card border p-1.5 rounded-2xl shadow-[var(--shadow-soft)]">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-2.5 text-xs sm:text-sm">
              <Sprout className="h-4 w-4 mr-1.5" />Farm Profile
            </TabsTrigger>
            <TabsTrigger value="ledger" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-2.5 text-xs sm:text-sm">
              <FileText className="h-4 w-4 mr-1.5" />Records
            </TabsTrigger>
            <TabsTrigger value="credit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-2.5 text-xs sm:text-sm">
              <Brain className="h-4 w-4 mr-1.5" />AI Credit
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-2.5 text-xs sm:text-sm">
              <CloudRain className="h-4 w-4 mr-1.5" />Risk
            </TabsTrigger>
            <TabsTrigger value="lender" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-2.5 text-xs sm:text-sm">
              <Banknote className="h-4 w-4 mr-1.5" />Lender
            </TabsTrigger>
            <TabsTrigger value="graph" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-2.5 text-xs sm:text-sm">
              <Network className="h-4 w-4 mr-1.5" />Neo4j
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="profile"><TabFarmProfile /></TabsContent>
            <TabsContent value="ledger"><TabRecordsLedger /></TabsContent>
            <TabsContent value="credit"><TabCredit /></TabsContent>
            <TabsContent value="risk"><TabRisk /></TabsContent>
            <TabsContent value="lender"><TabLender /></TabsContent>
            <TabsContent value="graph"><TabGraph /></TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}

function TabHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-2xl font-bold">{title}</h3>
      {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

function MetricRow({ label, value, color = "primary" }: { label: string; value: number; color?: "primary" | "gold" }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full ${color === "primary" ? "bg-primary" : "bg-gold"} rounded-full transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function TabFarmProfile() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 overflow-hidden">
        <div className="h-32" style={{ background: "var(--gradient-hero)" }} />
        <CardContent className="-mt-12 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="h-24 w-24 rounded-2xl bg-card border-4 border-card shadow-[var(--shadow-soft)] grid place-items-center text-3xl font-bold text-primary">
              JK
            </div>
            <div className="flex-1 sm:pb-2">
              <TabHeader title="Jean Kabuku" subtitle="Smallholder farmer · Verified profile" />
              <div className="flex flex-wrap gap-4 text-sm -mt-6">
                <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" />Musanze, Rwanda</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><Layers className="h-4 w-4" />2.4 Acres</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><Sprout className="h-4 w-4" />Maize · Beans</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><CheckCircle2 className="h-4 w-4" />6 Years</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <MetricRow label="Profile Completion" value={92} />
            <MetricRow label="Digital Record Strength" value={84} />
            <MetricRow label="Farm Verification" value={100} color="gold" />
            <MetricRow label="Finance Readiness" value={78} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Verification</CardTitle></CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            {["Identity confirmed", "GPS farm boundary mapped", "Field photos uploaded", "Local cooperative endorsement"].map((t) => (
              <div key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /><span>{t}</span></div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border-0">
          <CardContent className="pt-6">
            <div className="text-xs uppercase tracking-wider opacity-80">Status</div>
            <div className="text-2xl font-bold mt-1">Ready for assessment</div>
            <p className="text-sm opacity-90 mt-2">Profile meets Mavuno standards for AI credit scoring.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TabRecordsLedger() {
  const production = [
    { season: "Season A", crop: "Maize", yield: 3.8 },
    { season: "Season B", crop: "Beans", yield: 1.6 },
  ];
  const sales = [
    { date: "Mar 14", item: "Maize Sale", amount: 280 },
    { date: "Apr 22", item: "Beans Sale", amount: 150 },
  ];
  const expenses = [
    { date: "Feb 5", item: "Fertilizer", amount: 80 },
    { date: "Feb 8", item: "Seeds", amount: 60 },
  ];

  const monthly = [
    { m: "Jan", revenue: 0, expense: 0 },
    { m: "Feb", revenue: 0, expense: 140 },
    { m: "Mar", revenue: 280, expense: 0 },
    { m: "Apr", revenue: 150, expense: 0 },
    { m: "May", revenue: 0, expense: 0 },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Cash flow this season</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-primary)" name="Revenue $" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="var(--color-gold)" name="Expense $" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 gap-6">
          <LedgerTable title="Production Records" headers={["Season", "Crop", "Yield"]} rows={production.map((p) => [p.season, p.crop, `${p.yield} t`])} />
          <LedgerTable title="Sales Records" headers={["Date", "Item", "Amount"]} rows={sales.map((s) => [s.date, s.item, `$${s.amount}`])} />
        </div>
        <LedgerTable title="Expenses" headers={["Date", "Expense", "Amount"]} rows={expenses.map((e) => [e.date, e.item, `$${e.amount}`])} />
      </div>

      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border-0">
          <CardContent className="pt-6 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">Revenue</div>
              <div className="text-3xl font-bold">$430</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">Expenses</div>
              <div className="text-3xl font-bold">$140</div>
            </div>
            <div className="pt-3 border-t border-white/20">
              <div className="text-xs uppercase tracking-wider opacity-80">Estimated Net Farm Income</div>
              <div className="text-4xl font-extrabold flex items-baseline gap-2">$290<span className="text-sm font-medium opacity-80">net</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Record quality</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <MetricRow label="Production logs" value={90} />
            <MetricRow label="Sales receipts" value={75} color="gold" />
            <MetricRow label="Expense receipts" value={60} color="gold" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LedgerTable({ title, headers, rows }: { title: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>{headers.map((h) => <th key={h} className="text-left font-medium px-4 py-2.5">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                {r.map((c, j) => <td key={j} className="px-4 py-2.5">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function TabCredit() {
  const breakdown = [
    { label: "Farm Records", value: 85 },
    { label: "Production Consistency", value: 80 },
    { label: "Income Evidence", value: 75 },
    { label: "Climate Preparedness", value: 72 },
    { label: "Financial Discipline", value: 77 },
  ];
  const score = 78;
  const data = [{ name: "score", value: score }, { name: "rest", value: 100 - score }];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="overflow-hidden">
        <CardContent className="pt-6 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Credit Readiness Score</div>
          <div className="relative h-56 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={70}
                  outerRadius={95}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="var(--color-primary)" />
                  <Cell fill="var(--color-muted)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-extrabold text-primary">{score}</div>
              <div className="text-xs text-muted-foreground">out of 100</div>
            </div>
          </div>
          <Badge className="bg-accent text-primary border-0">Good · Eligible for SACCO financing</Badge>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-base">Score breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {breakdown.map((b) => <MetricRow key={b.label} {...b} />)}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4 text-primary" />AI insights</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-semibold mb-3 text-primary">Strengths</div>
            <ul className="space-y-2 text-sm">
              {["Consistent production history", "Good record keeping", "Positive revenue trends"].map((t) => (
                <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-3 text-gold-foreground">Recommendations</div>
            <ul className="space-y-2 text-sm">
              {["Upload previous season records", "Record additional sales transactions", "Adopt drought-resistant seed", "Improve expense tracking"].map((t) => (
                <li key={t} className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold mt-0.5 shrink-0" />{t}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TabRisk() {
  const forecast = [
    { day: "Day 1", label: "Moderate Rain", icon: CloudDrizzle, mm: 8 },
    { day: "Day 2", label: "Heavy Rain", icon: CloudRain, mm: 22 },
    { day: "Day 3", label: "Cloudy", icon: Cloud, mm: 1 },
    { day: "Day 4", label: "Sunny", icon: Sun, mm: 0 },
    { day: "Day 5", label: "Sunny", icon: Sun, mm: 0 },
    { day: "Day 6", label: "Cloudy", icon: Cloud, mm: 3 },
    { day: "Day 7", label: "Moderate Rain", icon: CloudDrizzle, mm: 12 },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><CloudRain className="h-4 w-4 text-primary" />Weather (Open-Meteo)</CardTitle>
            <Badge className="bg-gold text-gold-foreground border-0">Risk: Medium</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-5">
            {forecast.map((f) => (
              <div key={f.day} className="rounded-xl border bg-card p-2 text-center">
                <div className="text-[10px] text-muted-foreground">{f.day}</div>
                <f.icon className="h-5 w-5 mx-auto my-1.5 text-primary" />
                <div className="text-[10px] font-medium leading-tight">{f.label}</div>
              </div>
            ))}
          </div>
          <div className="h-44">
            <ResponsiveContainer>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                <Line type="monotone" dataKey="mm" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ fill: "var(--color-primary)" }} name="Rainfall (mm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <MetricRow label="Weather Risk Score" value={68} color="gold" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4 text-primary" />Soil (SoilGrids)</CardTitle>
            <Badge className="bg-accent text-primary border-0">Soil Readiness 82%</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Organic Carbon", v: "Good" },
              { l: "Nitrogen", v: "Moderate" },
              { l: "Soil pH", v: "6.4" },
              { l: "Water Retention", v: "High" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border bg-muted/30 p-3">
                <div className="text-xs text-muted-foreground">{s.l}</div>
                <div className="font-semibold mt-0.5">{s.v}</div>
              </div>
            ))}
          </div>
          <MetricRow label="Soil Readiness" value={82} />
          <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 text-sm">
            <div className="font-semibold text-primary mb-1 flex items-center gap-1.5"><Sprout className="h-4 w-4" />Recommendation</div>
            Suitable for maize and bean production. Consider intercropping to improve nitrogen balance next season.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TabLender() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Applicant: Jean Kabuku</CardTitle>
            <Badge className="bg-accent text-primary border-0">Loan request · $500</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-5">
            <span className="font-medium text-foreground">Purpose:</span> Purchase improved seed and fertilizer for Season A maize cycle.
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <MetricRow label="Credit Readiness" value={78} />
            <MetricRow label="Farm Performance" value={84} />
            <MetricRow label="Climate Risk (lower is better)" value={32} color="gold" />
            <MetricRow label="Repayment Probability" value={81} />
          </div>

          <div className="mt-7 rounded-xl border bg-muted/30 p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Decision support</div>
            <div className="text-lg font-semibold flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Approve with seasonal monitoring</div>
            <p className="text-sm text-muted-foreground mt-2">Approve at requested amount with light-touch in-season check-ins after planting and at harvest milestones.</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border-0">
          <CardContent className="pt-6">
            <div className="text-xs uppercase tracking-wider opacity-80">Risk Category</div>
            <div className="text-2xl font-bold mt-1">Medium-Low</div>
            <div className="mt-4 text-xs uppercase tracking-wider opacity-80">Suggested Loan Range</div>
            <div className="text-3xl font-extrabold">$400 – $700</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Signals reviewed</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              "12 months of farm records",
              "Verified GPS field boundaries",
              "Open-Meteo seasonal forecast",
              "SoilGrids fertility indicators",
              "Cooperative endorsement",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />{t}</div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TabGraph() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <TabHeader title="Connected Farm Intelligence" subtitle="Hover any node to highlight its connections in the Mavuno knowledge graph." />
        <KnowledgeGraph />
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4 text-primary" />Sample Cypher</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs bg-foreground text-background rounded-xl p-4 overflow-x-auto leading-relaxed">
{`MATCH (f:Farmer)-[:OWNS]->(farm)
      -[:PRODUCES]->(crop)
RETURN f, farm, crop`}
            </pre>
          </CardContent>
        </Card>
        <Card className="bg-accent/50 border-primary/15">
          <CardContent className="pt-6 text-sm leading-relaxed">
            Mavuno uses <span className="font-semibold text-primary">Neo4j</span> to connect farm activities, production, weather, soil conditions, and finance readiness into a single knowledge graph — making complex farmer risk explainable in one query.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Relationships</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {["OWNS", "PRODUCES", "GENERATED", "AFFECTED_BY", "ASSESSED_BY", "APPLIED_FOR", "QUALIFIES_FOR"].map((r) => (
              <Badge key={r} variant="outline" className="font-mono text-[10px]">{r}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ========== IMPACT / ROADMAP / FOOTER ========== */

function Impact() {
  const farmers = ["Better farm records", "Understand finance readiness", "Improve lender trust", "Access finance faster"];
  const lenders = ["Better risk visibility", "Lower assessment costs", "Faster decision-making", "More inclusive lending"];
  return (
    <section id="impact" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Impact" title="Built for both sides of the loan" />
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/15 bg-gradient-to-br from-card to-accent/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground grid place-items-center"><Sprout className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">For</div>
                  <h3 className="text-xl font-bold">Farmers</h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {farmers.map((f) => <li key={f} className="flex gap-2.5 text-sm"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" />{f}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-2 border-gold/30 bg-gradient-to-br from-card to-gold/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-gold text-gold-foreground grid place-items-center"><Banknote className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">For</div>
                  <h3 className="text-xl font-bold">Lenders</h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {lenders.map((f) => <li key={f} className="flex gap-2.5 text-sm"><CheckCircle2 className="h-5 w-5 text-gold shrink-0" />{f}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function FutureVision() {
  const phases = [
    { tag: "Phase 1", title: "Foundation", items: ["Farm records", "Credit readiness", "AI recommendations"], active: true },
    { tag: "Phase 2", title: "Scale", items: ["Mobile app", "Offline support", "Lender portal"], active: false },
    { tag: "Phase 3", title: "Ecosystem", items: ["Loan marketplace", "Digital loan applications", "Automated risk monitoring", "Regional expansion"], active: false },
  ];
  return (
    <section id="vision" className="py-20 bg-muted/30 border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Roadmap" title="The future of agricultural finance" />
        <div className="grid md:grid-cols-3 gap-5">
          {phases.map((p) => (
            <Card key={p.tag} className={`relative overflow-hidden ${p.active ? "border-primary/40 shadow-[var(--shadow-soft)]" : ""}`}>
              {p.active && <div className="absolute top-3 right-3"><Badge className="bg-primary text-primary-foreground border-0">In progress</Badge></div>}
              <CardContent className="pt-6">
                <div className="text-xs uppercase tracking-wider text-primary font-semibold">{p.tag}</div>
                <div className="text-xl font-bold mt-1 mb-4">{p.title}</div>
                <ul className="space-y-2 text-sm">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2"><ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />{it}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-black-foreground">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoAsset} alt="Mavuno logo" className="h-12 w-12 object-contain bg-white/95 rounded-xl p-1" />
              <span className="text-2xl font-bold text-primary">mavuno</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Turning farm records into financial opportunity.</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-secondary text-white hover:bg-black/90">
              <a href="#prototype">Explore Demo</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-primary text-primary-foreground hover:bg-white/10">
              <a href="mailto:team@mavuno.app">Contact Team</a>
            </Button>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between text-xs opacity-80 gap-2">
          <div>© 2026 Mavuno. AI-powered credit readiness for smallholder farmers.</div>
          <div>Built for Mercy Corps AgriFin · Phase 2 prototype</div>
        </div>
      </div>
    </footer>
  );
}
