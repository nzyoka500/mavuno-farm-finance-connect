import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Sprout, LogOut, Plus, Trash2, Pencil, MapPin, TrendingUp, TrendingDown,
  Brain, ShieldAlert, CloudRain, Send, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  useAuth, useFarms, useRecords, useApplications, computeCreditScore,
  aiRecommendations, riskProfile, type Farm, type LedgerEntry,
} from "@/lib/mock-store";

export const Route = createFileRoute("/farmer")({
  head: () => ({ meta: [{ title: "Farmer Dashboard — Mavuno" }] }),
  component: FarmerDashboard,
});

function FarmerDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (currentUser === null) navigate({ to: "/auth" });
    else if (currentUser && currentUser.role !== "farmer") navigate({ to: "/lender" });
  }, [currentUser, navigate]);

  const { farms, add: addFarm, update: updateFarm, remove: removeFarm } = useFarms(currentUser?.id);
  const { records, add: addRecord, remove: removeRecord } = useRecords(currentUser?.id);
  const { applications, add: addApp } = useApplications(currentUser?.id);

  const score = useMemo(() => computeCreditScore(records, farms), [records, farms]);
  const recs = useMemo(() => aiRecommendations(farms, records), [farms, records]);
  const risk = useMemo(() => riskProfile(farms), [farms]);

  const totalRevenue = records.filter((r) => r.type === "revenue").reduce((s, r) => s + r.amount, 0);
  const totalExpense = records.filter((r) => r.type === "expense").reduce((s, r) => s + r.amount, 0);

  const chartData = useMemo(() => {
    const months: Record<string, { month: string; revenue: number; expense: number }> = {};
    records.forEach((r) => {
      const m = r.date.slice(0, 7);
      months[m] ??= { month: m, revenue: 0, expense: 0 };
      months[m][r.type] += r.amount;
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [records]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Sprout className="text-primary" /> Mavuno
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.region}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate({ to: "/auth" }); }}>
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard label="Credit Score" value={String(score)} icon={<Brain className="text-primary" />} hint={score >= 70 ? "Ready" : "Building"} />
          <StatCard label="Revenue" value={`$${totalRevenue}`} icon={<TrendingUp className="text-emerald-600" />} />
          <StatCard label="Expenses" value={`$${totalExpense}`} icon={<TrendingDown className="text-red-500" />} />
          <StatCard label="Farms" value={String(farms.length)} icon={<MapPin className="text-secondary" />} />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farms">Farms</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
            <TabsTrigger value="apply">Apply Loan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Cashflow</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                    <Bar dataKey="expense" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>My Loan Applications</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {applications.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
                {applications.map((a) => (
                  <div key={a.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">${a.amount} — {a.purpose}</p>
                      <p className="text-xs text-muted-foreground">{a.submittedAt}</p>
                    </div>
                    <Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"}>
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farms">
            <FarmsTab farms={farms} ownerId={currentUser.id} onAdd={addFarm} onUpdate={updateFarm} onRemove={removeFarm} />
          </TabsContent>

          <TabsContent value="records">
            <RecordsTab records={records} ownerId={currentUser.id} onAdd={addRecord} onRemove={removeRecord} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="text-primary" /> Credit Readiness</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-5xl font-bold text-primary">{score}</span>
                  <span className="text-muted-foreground pb-2">/ 100</span>
                </div>
                <Progress value={score} />
                <p className="text-sm text-muted-foreground mt-2">
                  {score >= 70 ? "You're credit-ready. Lenders can see a strong profile." : "Add more records and diversify to grow your score."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Personalized Recommendations</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {recs.map((r, i) => (
                  <div key={i} className="flex gap-2 p-3 bg-primary/5 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{r}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="text-secondary" /> Risk Profile</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <RiskBar label="Climate / Rainfall" value={risk.climate} icon={<CloudRain className="h-4 w-4" />} />
                <RiskBar label="Market price volatility" value={risk.market} />
                <RiskBar label="Pest & disease" value={risk.pest} />
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">Overall risk: <span className={risk.overall > 60 ? "text-red-500" : "text-emerald-600"}>{risk.overall}/100</span></p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apply">
            <ApplyLoanTab score={score} onSubmit={(amount, purpose) => addApp({
              farmerId: currentUser.id, farmerName: currentUser.name,
              amount, purpose, status: "pending", creditScore: score,
              submittedAt: new Date().toISOString().slice(0, 10),
            })} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, hint }: { label: string; value: string; icon: React.ReactNode; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground uppercase">{label}</span>
          {icon}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function RiskBar({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="flex items-center gap-1">{icon}{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function FarmsTab({ farms, ownerId, onAdd, onUpdate, onRemove }: {
  farms: Farm[]; ownerId: string;
  onAdd: (f: Omit<Farm, "id">) => void;
  onUpdate: (id: string, p: Partial<Farm>) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Farm | null>(null);
  const empty = { name: "", crop: "", sizeAcres: 1, location: "", soilType: "Loam", irrigation: "Rain-fed", plantingDate: new Date().toISOString().slice(0, 10) };
  const [form, setForm] = useState<Omit<Farm, "id" | "ownerId">>(empty);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (f: Farm) => { setEditing(f); setForm(f); setOpen(true); };
  const save = () => {
    if (editing) onUpdate(editing.id, form);
    else onAdd({ ...form, ownerId });
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Farms</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add farm</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} farm</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Crop</Label><Input value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} /></div>
                <div><Label>Size (acres)</Label><Input type="number" step="0.1" value={form.sizeAcres} onChange={(e) => setForm({ ...form, sizeAcres: +e.target.value })} /></div>
              </div>
              <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Soil</Label>
                  <Select value={form.soilType} onValueChange={(v) => setForm({ ...form, soilType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Loam", "Clay", "Sandy", "Clay-loam", "Silt"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Irrigation</Label>
                  <Select value={form.irrigation} onValueChange={(v) => setForm({ ...form, irrigation: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Rain-fed", "Drip", "Sprinkler", "Flood"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Planting date</Label><Input type="date" value={form.plantingDate} onChange={(e) => setForm({ ...form, plantingDate: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {farms.length === 0 && <p className="text-sm text-muted-foreground">No farms yet. Add your first plot.</p>}
        {farms.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{f.name} <Badge variant="outline" className="ml-1">{f.crop}</Badge></p>
              <p className="text-xs text-muted-foreground">{f.sizeAcres} ac · {f.location} · {f.soilType} · {f.irrigation}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => onRemove(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecordsTab({ records, ownerId, onAdd, onRemove }: {
  records: LedgerEntry[]; ownerId: string;
  onAdd: (r: Omit<LedgerEntry, "id">) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "expense" as "revenue" | "expense", category: "", amount: 0, date: new Date().toISOString().slice(0, 10), note: "",
  });
  const save = () => { onAdd({ ...form, ownerId }); setOpen(false); setForm({ ...form, category: "", amount: 0, note: "" }); };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Records</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add record</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New record</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "revenue" | "expense" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Seeds, Fertilizer, Harvest…" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Amount ($)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: +e.target.value })} /></div>
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              </div>
              <div><Label>Note</Label><Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {records.length === 0 && <p className="text-sm text-muted-foreground py-4">No records yet.</p>}
          {[...records].sort((a, b) => b.date.localeCompare(a.date)).map((r) => (
            <div key={r.id} className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium">{r.category}</p>
                <p className="text-xs text-muted-foreground">{r.date} · {r.note || "—"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${r.type === "revenue" ? "text-emerald-600" : "text-red-500"}`}>
                  {r.type === "revenue" ? "+" : "-"}${r.amount}
                </span>
                <Button size="icon" variant="ghost" onClick={() => onRemove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ApplyLoanTab({ score, onSubmit }: { score: number; onSubmit: (amount: number, purpose: string) => void }) {
  const [amount, setAmount] = useState(500);
  const [purpose, setPurpose] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!purpose) return;
    onSubmit(amount, purpose);
    setSent(true);
    setPurpose("");
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Apply for a Loan</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-primary/5 rounded-lg flex items-center justify-between">
          <span className="text-sm">Your current credit score</span>
          <Badge>{score}/100</Badge>
        </div>
        <div><Label>Amount requested ($)</Label><Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} /></div>
        <div><Label>Purpose</Label><Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Seeds for Season B" /></div>
        <Button onClick={submit} className="w-full"><Send className="h-4 w-4 mr-1" /> Submit application</Button>
        {sent && <p className="text-sm text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Application submitted to lenders.</p>}
      </CardContent>
    </Card>
  );
}
