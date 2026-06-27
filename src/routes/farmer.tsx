import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Sprout,
  LogOut,
  MapPin,
  TrendingUp,
  TrendingDown,
  Brain,
  ShieldAlert,
  CloudRain,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/lib/auth-store";
import {
  farmerApi,
  type FarmOut,
  type CreditProfileOut,
  type FinancialProfileOut,
  type ProductionRecordOut,
  type LoanHistoryOut,
} from "@/lib/api";

export const Route = createFileRoute("/farmer")({
  head: () => ({ meta: [{ title: "Farmer Dashboard — Mavuno" }] }),
  component: FarmerDashboard,
});

// ── Data hook ────────────────────────────────────────────────────────────────

function useFarmerData(farmerId: string) {
  const [farms, setFarms] = useState<FarmOut[]>([]);
  const [credit, setCredit] = useState<CreditProfileOut | null>(null);
  const [financial, setFinancial] = useState<FinancialProfileOut | null>(null);
  const [production, setProduction] = useState<ProductionRecordOut[]>([]);
  const [loans, setLoans] = useState<LoanHistoryOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!farmerId) return;
    setLoading(true);
    Promise.all([
      farmerApi.farms(farmerId),
      farmerApi.creditProfile(farmerId),
      farmerApi.financialProfile(farmerId),
      farmerApi.production(farmerId),
      farmerApi.loanHistory(farmerId),
    ])
      .then(([f, c, fin, p, l]) => {
        setFarms(f);
        setCredit(c);
        setFinancial(fin);
        setProduction(p);
        setLoans(l);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, [farmerId]);

  return { farms, credit, financial, production, loans, loading, error };
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function FarmerDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (currentUser === null) navigate({ to: "/auth" });
    else if (currentUser && currentUser.role !== "farmer") navigate({ to: "/lender" });
  }, [currentUser, navigate]);

  const farmerId = currentUser?.userId ?? "";
  const { farms, credit, financial, production, loans, loading, error } = useFarmerData(farmerId);

  // Build cashflow chart data from production sales
  const chartData = useMemo(() => {
    const months: Record<string, { month: string; revenue: number }> = {};
    production.forEach((p) => {
      p.sales.forEach((s) => {
        const m = (s.createdAt ?? "").slice(0, 7);
        if (!m) return;
        months[m] ??= { month: m, revenue: 0 };
        months[m].revenue += s.amount;
      });
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [production]);

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate({ to: "/auth" });
              }}
            >
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading your dashboard…
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Stat cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard
                label="Credit Score"
                value={credit ? String(Math.round(credit.score)) : "—"}
                icon={<Brain className="text-primary" />}
                hint={credit ? credit.readinessLevel : undefined}
              />
              <StatCard
                label="Revenue"
                value={financial ? `KES ${financial.totalRevenue.toLocaleString()}` : "—"}
                icon={<TrendingUp className="text-emerald-600" />}
              />
              <StatCard
                label="Expenses"
                value={financial ? `KES ${financial.totalExpenses.toLocaleString()}` : "—"}
                icon={<TrendingDown className="text-red-500" />}
              />
              <StatCard
                label="Farms"
                value={String(farms.length)}
                icon={<MapPin className="text-secondary" />}
              />
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="farms">Farms</TabsTrigger>
                <TabsTrigger value="production">Production</TabsTrigger>
                <TabsTrigger value="ai">AI Insights</TabsTrigger>
                <TabsTrigger value="loans">Loan History</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Revenue by Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No sales data yet.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Farms */}
              <TabsContent value="farms">
                <Card>
                  <CardHeader>
                    <CardTitle>My Farms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {farms.length === 0 && (
                      <p className="text-sm text-muted-foreground">No farms on record.</p>
                    )}
                    {farms.map((f) => (
                      <div
                        key={f.farmId}
                        className="flex items-start justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {f.farmName}
                            {f.cropsGrown.map((c) => (
                              <Badge key={c} variant="outline" className="ml-1">
                                {c}
                              </Badge>
                            ))}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {f.sizeAcres} ac · {f.county ?? "—"} · {f.ownershipType}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Production */}
              <TabsContent value="production">
                <Card>
                  <CardHeader>
                    <CardTitle>Production Records</CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {production.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4">No production records.</p>
                    )}
                    {production.map((p) => (
                      <div key={p.productionId} className="py-3">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">
                            {p.cropName ?? "Crop"} — {p.season}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {p.productionDate ?? "—"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {p.quantity} {p.unit}
                        </p>
                        {p.sales.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {p.sales.map((s) => (
                              <div
                                key={s.saleId}
                                className="text-xs flex justify-between text-muted-foreground"
                              >
                                <span>
                                  {s.buyerName} ({s.buyerType})
                                </span>
                                <span className="text-emerald-600 font-medium">
                                  {s.currency} {s.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Insights */}
              <TabsContent value="ai" className="space-y-4">
                {credit && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="text-primary" /> Credit Readiness
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-3 mb-2">
                          <span className="text-5xl font-bold text-primary">
                            {Math.round(credit.score)}
                          </span>
                          <span className="text-muted-foreground pb-2">/ 100</span>
                        </div>
                        <Progress value={credit.score} />
                        <p className="text-sm text-muted-foreground mt-2">
                          {credit.readinessLevel} · Confidence:{" "}
                          {Math.round(credit.confidenceLevel * 100)}%
                        </p>
                      </CardContent>
                    </Card>

                    {credit.recommendations.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {credit.recommendations.map((r) => (
                            <div
                              key={r.recommendationId}
                              className="flex gap-2 p-3 bg-primary/5 rounded-lg"
                            >
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">{r.title}</p>
                                <p className="text-xs text-muted-foreground">{r.description}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {credit.risks.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="text-secondary" /> Risk Factors
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {credit.risks.map((r) => (
                            <div
                              key={r.riskId}
                              className="flex items-start gap-2 p-3 border rounded-lg"
                            >
                              <CloudRain className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">{r.category}</p>
                                  <Badge
                                    variant={
                                      r.severity === "high"
                                        ? "destructive"
                                        : r.severity === "medium"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {r.severity}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{r.description}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
                {!credit && <p className="text-sm text-muted-foreground">No credit profile yet.</p>}
              </TabsContent>

              {/* Loan History */}
              <TabsContent value="loans">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan History</CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {loans.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4">
                        No loan history on record.
                      </p>
                    )}
                    {loans.map((l) => (
                      <div key={l.loanId} className="py-3 flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {l.lenderName}
                            <Badge variant="outline" className="ml-2">
                              {l.lenderType}
                            </Badge>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {l.currency} {l.loanAmount.toLocaleString()} · {l.startDate ?? "—"} →{" "}
                            {l.closedDate ?? "ongoing"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Repaid: {l.currency} {l.repaidAmount.toLocaleString()} ·{" "}
                            {l.isOnTime ? "On time ✓" : "Late ✗"}
                          </p>
                        </div>
                        <Badge
                          variant={
                            l.status === "closed"
                              ? "default"
                              : l.status === "active"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {l.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  hint?: string;
}) {
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
