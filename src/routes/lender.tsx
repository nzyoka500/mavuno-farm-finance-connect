import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Sprout, LogOut, CheckCircle2, XCircle, Search, Banknote, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useApplications, type Application } from "@/lib/mock-store";

export const Route = createFileRoute("/lender")({
  head: () => ({ meta: [{ title: "Lender Dashboard — Mavuno" }] }),
  component: LenderDashboard,
});

function LenderDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { applications, update, remove } = useApplications();
  const [filter, setFilter] = useState<"all" | Application["status"]>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);

  useEffect(() => {
    if (currentUser === null) navigate({ to: "/auth" });
    else if (currentUser && currentUser.role !== "lender") navigate({ to: "/farmer" });
  }, [currentUser, navigate]);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (q && !a.farmerName.toLowerCase().includes(q.toLowerCase()) && !a.purpose.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [applications, filter, q]);

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    volume: applications.filter((a) => a.status === "approved").reduce((s, a) => s + a.amount, 0),
  }), [applications]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Sprout className="text-primary" /> Mavuno <Badge variant="secondary" className="ml-1">Lender</Badge>
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
          <Stat label="Total applications" value={String(stats.total)} icon={<Users className="text-primary" />} />
          <Stat label="Pending review" value={String(stats.pending)} icon={<Clock className="text-secondary" />} />
          <Stat label="Approved" value={String(stats.approved)} icon={<CheckCircle2 className="text-emerald-600" />} />
          <Stat label="Disbursed volume" value={`$${stats.volume}`} icon={<Banknote className="text-primary" />} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <CardTitle>Loan Applications</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8 w-60" placeholder="Search farmer or purpose" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
              </div>
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mt-3">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="py-2">Farmer</th>
                    <th className="py-2">Purpose</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Score</th>
                    <th className="py-2">Submitted</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-muted/40">
                      <td className="py-2 font-medium">{a.farmerName}</td>
                      <td className="py-2">{a.purpose}</td>
                      <td className="py-2">${a.amount}</td>
                      <td className="py-2">
                        <Badge variant={a.creditScore >= 70 ? "default" : a.creditScore >= 50 ? "secondary" : "destructive"}>
                          {a.creditScore}
                        </Badge>
                      </td>
                      <td className="py-2">{a.submittedAt}</td>
                      <td className="py-2">
                        <Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"}>
                          {a.status}
                        </Badge>
                      </td>
                      <td className="py-2 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelected(a)}>Review</Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No applications match.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Application — {selected?.farmerName}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <Row k="Purpose" v={selected.purpose} />
              <Row k="Amount" v={`$${selected.amount}`} />
              <Row k="Credit score" v={`${selected.creditScore}/100`} />
              <Row k="Submitted" v={selected.submittedAt} />
              <Row k="Status" v={selected.status} />
              <div className="p-3 bg-primary/5 rounded-lg text-sm">
                <strong>AI assessment:</strong>{" "}
                {selected.creditScore >= 70
                  ? "Strong farm records and diversified crops. Recommended for approval."
                  : selected.creditScore >= 50
                  ? "Moderate risk. Consider partial approval or shorter term."
                  : "High risk profile. Suggest declining or requesting collateral."}
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => { update(selected.id, { status: "approved" }); setSelected(null); }}>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button className="flex-1" variant="destructive" onClick={() => { update(selected.id, { status: "rejected" }); setSelected(null); }}>
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button variant="outline" onClick={() => { remove(selected.id); setSelected(null); }}>Delete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card><CardContent className="p-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase text-muted-foreground">{label}</span>{icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent></Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
