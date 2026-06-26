import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sprout, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, type Role } from "@/lib/mock-store";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Mavuno" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { currentUser, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("farmer");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", region: "" });

  useEffect(() => {
    if (currentUser) {
      navigate({ to: currentUser.role === "farmer" ? "/farmer" : "/lender" });
    }
  }, [currentUser, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      const r = login(form.email, form.password);
      if (!r.ok) return setError(r.error);
      navigate({ to: r.user.role === "farmer" ? "/farmer" : "/lender" });
    } else {
      if (!form.name || !form.email || form.password.length < 6) {
        return setError("Name, email and a 6+ char password are required.");
      }
      const r = register({ ...form, role });
      if (!r.ok) return setError(r.error);
      navigate({ to: role === "farmer" ? "/farmer" : "/lender" });
    }
  };

  const fillDemo = (r: Role) => {
    setMode("login");
    setForm({ ...form, email: r === "farmer" ? "farmer@mavuno.demo" : "lender@mavuno.demo", password: "demo1234" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Sprout className="text-primary" /> Mavuno
        </Link>
        <Link to="/" className="text-sm text-muted-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Mavuno</CardTitle>
            <p className="text-sm text-muted-foreground">Build your farm profile and unlock credit.</p>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "register")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <form onSubmit={submit} className="space-y-4 mt-4">
                {mode === "register" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={role === "farmer" ? "default" : "outline"}
                        onClick={() => setRole("farmer")}
                      >
                        I'm a Farmer
                      </Button>
                      <Button
                        type="button"
                        variant={role === "lender" ? "default" : "outline"}
                        onClick={() => setRole("lender")}
                      >
                        I'm a Lender
                      </Button>
                    </div>
                    <div>
                      <Label>Full name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Phone</Label>
                        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div>
                        <Label>Region</Label>
                        <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full">
                  {mode === "login" ? "Sign in" : "Create account"}
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Quick demo access:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => fillDemo("farmer")}>
                    Farmer demo
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => fillDemo("lender")}>
                    Lender demo
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Password: <code>demo1234</code>
                </p>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
