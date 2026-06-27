import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Role } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Mavuno" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { currentUser, loading, login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("farmer");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    region: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate({ to: currentUser.role === "farmer" ? "/farmer" : "/lender" });
    }
  }, [currentUser, navigate]);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const user = await login(form.email, form.password);
        navigate({ to: user.role === "farmer" ? "/farmer" : "/lender" });
      } else {
        if (!form.name || !form.email || form.password.length < 6) {
          return setError("Name, email and a 6+ char password are required.");
        }
        const user = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          region: form.region || undefined,
          role,
        });
        navigate({ to: user.role === "farmer" ? "/farmer" : "/lender" });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // 409 → duplicate email; 401 → wrong credentials
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const fillDemo = (r: Role) => {
    setMode("login");
    setForm((f) => ({
      ...f,
      email: r === "farmer" ? "farmer@mavuno.demo" : "lender@mavuno.demo",
      password: "demo1234",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <ArrowLeft className="h-4 w-4" /> Back Home
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Mavuno</CardTitle>
            <p className="text-sm text-muted-foreground">
              Build your farm profile and unlock credit.
            </p>
          </CardHeader>

          <CardContent>
            <Tabs
              value={mode}
              onValueChange={(v) => {
                setMode(v as typeof mode);
                setError("");
              }}
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <form onSubmit={submit} className="space-y-4 mt-4">
                {mode === "register" && (
                  <>
                    {/* Role selector */}
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
                      <Input {...field("name")} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Phone</Label>
                        <Input {...field("phone")} />
                      </div>
                      <div>
                        <Label>Region</Label>
                        <Input {...field("region")} />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label>Email</Label>
                  <Input type="email" {...field("email")} />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input type="password" {...field("password")} />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {mode === "login" ? "Signing in…" : "Creating account…"}
                    </span>
                  ) : mode === "login" ? (
                    "Sign in"
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              {/* Demo shortcuts */}
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
