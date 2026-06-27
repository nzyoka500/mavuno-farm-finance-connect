import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Sprout,
  LogOut,
  CheckCircle2,
  XCircle,
  Search,
  Banknote,
  Users,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-store";
import { lenderApi, farmerApi, type LenderApplicantOut, type CreditProfileOut } from "@/lib/api";

export const Route = createFileRoute("/lender")({
  head: () => ({ meta: [{ title: "Lender Dashboard — Mavuno" }] }),
  component: LenderDashboard,
});

function LenderDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [applicants, setApplicants] = useState<LenderApplicantOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<LenderApplicantOut | null>(null);
  const [selectedCredit, setSelectedCredit] = useState<CreditProfileOut | null>(null);
  const [creditLoading, setCreditLoading] = useState(false);

  useEffect(() => {
    if (currentUser === null) navigate({ to: "/auth" });
    else if (currentUser && currentUser.role !== "lender") navigate({ to: "/farmer" });
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser?.userId) return;
    setLoading(true);
    lenderApi
      .applicants(currentUser.userId)
      .then(setApplicants)
      .catch(() => setError("Failed to load applicants."))
      .finally(() => setLoading(false));
  }, [currentUser?.userId]);

  useEffect(() => {
    if (!selected) {
      setSelectedCredit(null);
      return;
    }
    setCreditLoading(true);
    farmerApi
      .creditProfile(selected.farmerId)
      .then(setSelectedCredit)
      .catch(() => setSelectedCredit(null))
      .finally(() => setCreditLoading(false));
  }, [selected]);

  const readinessRank = (level?: string) => {
    if (!level) return 0;
    if (level.toLowerCase().includes("high")) return 3;
    if (level.toLowerCase().includes("medium") || level.toLowerCase().includes("moderate"))
      return 2;
    return 1;
  };

  const filtered = useMemo(() => {
    // fix 2: was "useMe\n    mo"
    return applicants.filter((a) => {
      if (filter !== "all") {
        const rank = readinessRank(a.readinessLevel);
        if (filter === "high" && rank !== 3) return false;
        if (filter === "medium" && rank !== 2) return false;
        if (filter === "low" && rank !== 1) return false;
      }
      if (q && !a.fullName.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [applicants, filter, q]);

  const stats = useMemo(
    () => ({
      total: applicants.length,
      high: applicants.filter((a) => readinessRank(a.readinessLevel) === 3).length,
      medium: applicants.filter((a) => readinessRank(a.readinessLevel) === 2).length,
      avgScore: applicants.length
        ? Math.round(applicants.reduce((s, a) => s + (a.creditScore ?? 0), 0) / applicants.length)
        : 0,
    }),
    [applicants],
  );

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Sprout className="text-primary" /> Mavuno
            <Badge variant="secondary" className="ml-1">
              Lender
            </Badge>
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
        <div className="grid md:grid-cols-4 gap-4">
          <Stat
            label="Total applicants"
            value={String(stats.total)}
            icon={<Users className="text-primary" />}
          />
          <Stat
            label="High readiness"
            value={String(stats.high)}
            icon={<CheckCircle2 className="text-emerald-600" />}
          />
          <Stat
            label="Medium readiness"
            value={String(stats.medium)}
            icon={<Clock className="text-secondary" />}
          />
          <Stat
            label="Avg credit score"
            value={String(stats.avgScore)}
            icon={<Banknote className="text-primary" />}
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading applicants…
          </div>
        )}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
        )}

        {!loading && !error && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <CardTitle>Farmer Applicants</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8 w-60"
                    placeholder="Search farmer name"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>
              <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as typeof filter)}
                className="mt-3"
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="high">High</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="low">Low</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground border-b">
                    <tr>
                      <th className="py-2">Farmer</th>
                      <th className="py-2">Credit Score</th>
                      <th className="py-2">Readiness</th>
                      <th className="py-2">Applied</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.farmerId} className="border-b hover:bg-muted/40">
                        <td className="py-2 font-medium">{a.fullName}</td>
                        <td className="py-2">
                          <Badge
                            variant={
                              (a.creditScore ?? 0) >= 70
                                ? "default"
                                : (a.creditScore ?? 0) >= 50
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {a.creditScore ?? "—"}
                          </Badge>
                        </td>
                        <td className="py-2">{a.readinessLevel ?? "—"}</td>
                        <td className="py-2 text-muted-foreground">
                          {a.appliedAt ? a.appliedAt.slice(0, 10) : "—"}
                        </td>
                        <td className="py-2 text-right">
                          <Button size="sm" variant="outline" onClick={() => setSelected(a)}>
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                          No applicants match.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review — {selected?.fullName}</DialogTitle>
          </DialogHeader>

          {creditLoading && (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading credit profile…
            </div>
          )}

          {selected && !creditLoading && (
            <div className="space-y-3">
              <Row k="Credit score" v={String(selected.creditScore ?? "—")} />
              <Row k="Readiness" v={selected.readinessLevel ?? "—"} />
              <Row k="Applied" v={selected.appliedAt?.slice(0, 10) ?? "—"} />

              {selectedCredit && (
                <>
                  <div className="p-3 bg-primary/5 rounded-lg text-sm space-y-1">
                    <p className="font-medium">AI Assessment</p>
                    <p className="text-muted-foreground">
                      {(selectedCredit.score ?? 0) >= 70
                        ? "Strong farm records and diversified crops. Recommended for approval."
                        : (selectedCredit.score ?? 0) >= 50
                          ? "Moderate risk. Consider partial approval or a shorter term."
                          : "High risk profile. Suggest declining or requesting collateral."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {Math.round((selectedCredit.confidenceLevel ?? 0) * 100)}%
                    </p>
                  </div>

                  {selectedCredit.risks.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Risk factors
                      </p>
                      {selectedCredit.risks.map((r) => (
                        <div
                          key={r.riskId}
                          className="flex justify-between text-xs border rounded px-2 py-1"
                        >
                          <span>{r.category}</span>
                          <Badge
                            variant={r.severity === "high" ? "destructive" : "secondary"}
                            className="text-[10px]"
                          >
                            {r.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => setSelected(null)}>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button className="flex-1" variant="destructive" onClick={() => setSelected(null)}>
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                Approval actions will be wired to the loans API.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs uppercase text-muted-foreground">{label}</span>
          {icon}
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
