import { useEffect, useState, useCallback } from "react";

export type Role = "farmer" | "lender";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  region?: string;
};

export type Farm = {
  id: string;
  ownerId: string;
  name: string;
  crop: string;
  sizeAcres: number;
  location: string;
  soilType: string;
  irrigation: string;
  plantingDate: string;
};

export type LedgerEntry = {
  id: string;
  ownerId: string;
  date: string;
  type: "revenue" | "expense";
  category: string;
  amount: number;
  note?: string;
};

export type Application = {
  id: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  creditScore: number;
  submittedAt: string;
};

const KEYS = {
  users: "mavuno_users",
  session: "mavuno_session",
  farms: "mavuno_farms",
  records: "mavuno_records",
  apps: "mavuno_applications",
};

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("mavuno-store", { detail: key }));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function seedIfEmpty() {
  if (!isBrowser()) return;
  if (window.localStorage.getItem(KEYS.users)) return;

  const farmer: User = {
    id: "u_farmer_demo",
    name: "Amina Uwase",
    email: "farmer@mavuno.demo",
    password: "demo1234",
    role: "farmer",
    phone: "+250 788 000 111",
    region: "Musanze, Rwanda",
  };
  const lender: User = {
    id: "u_lender_demo",
    name: "Equity SACCO",
    email: "lender@mavuno.demo",
    password: "demo1234",
    role: "lender",
    region: "Kigali",
  };
  write<User[]>(KEYS.users, [farmer, lender]);

  write<Farm[]>(KEYS.farms, [
    { id: "f1", ownerId: farmer.id, name: "Hillside Plot A", crop: "Maize", sizeAcres: 2.5, location: "Musanze", soilType: "Loam", irrigation: "Rain-fed", plantingDate: "2026-02-15" },
    { id: "f2", ownerId: farmer.id, name: "Valley Plot B", crop: "Beans", sizeAcres: 1.2, location: "Musanze", soilType: "Clay-loam", irrigation: "Drip", plantingDate: "2026-03-01" },
  ]);

  write<LedgerEntry[]>(KEYS.records, [
    { id: "r1", ownerId: farmer.id, date: "2026-03-10", type: "expense", category: "Seeds", amount: 120 },
    { id: "r2", ownerId: farmer.id, date: "2026-03-12", type: "expense", category: "Fertilizer", amount: 180 },
    { id: "r3", ownerId: farmer.id, date: "2026-05-20", type: "revenue", category: "Maize harvest", amount: 640 },
    { id: "r4", ownerId: farmer.id, date: "2026-06-05", type: "revenue", category: "Beans sale", amount: 410 },
  ]);

  write<Application[]>(KEYS.apps, [
    { id: "a1", farmerId: farmer.id, farmerName: farmer.name, amount: 500, purpose: "Seeds & fertilizer for Season B", status: "pending", creditScore: 78, submittedAt: "2026-06-20" },
    { id: "a2", farmerId: "u_farmer_2", farmerName: "Jean-Paul Habimana", amount: 1200, purpose: "Drip irrigation kit", status: "approved", creditScore: 82, submittedAt: "2026-06-15" },
    { id: "a3", farmerId: "u_farmer_3", farmerName: "Grace Mukamana", amount: 300, purpose: "Improved seed variety", status: "rejected", creditScore: 41, submittedAt: "2026-06-10" },
    { id: "a4", farmerId: "u_farmer_4", farmerName: "Eric Niyonsenga", amount: 850, purpose: "Greenhouse plastic & poles", status: "pending", creditScore: 71, submittedAt: "2026-06-22" },
  ]);
}

function useStore<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => read(key, fallback));
  useEffect(() => {
    seedIfEmpty();
    setValue(read(key, fallback));
    const onChange = () => setValue(read(key, fallback));
    window.addEventListener("mavuno-store", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("mavuno-store", onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback((v: T) => write(key, v), [key]);
  return [value, set];
}

export function useAuth() {
  const [users, setUsers] = useStore<User[]>(KEYS.users, []);
  const [session, setSession] = useStore<{ userId: string } | null>(KEYS.session, null);
  const currentUser = session ? users.find((u) => u.id === session.userId) ?? null : null;

  const register = (input: Omit<User, "id">) => {
    if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      return { ok: false as const, error: "Email already registered" };
    }
    const user: User = { ...input, id: "u_" + uid() };
    setUsers([...users, user]);
    write(KEYS.session, { userId: user.id });
    return { ok: true as const, user };
  };

  const login = (email: string, password: string) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!user) return { ok: false as const, error: "Invalid email or password" };
    setSession({ userId: user.id });
    return { ok: true as const, user };
  };

  const logout = () => setSession(null);

  return { currentUser, register, login, logout };
}

export function useFarms(ownerId?: string) {
  const [farms, setFarms] = useStore<Farm[]>(KEYS.farms, []);
  const list = ownerId ? farms.filter((f) => f.ownerId === ownerId) : farms;
  return {
    farms: list,
    add: (f: Omit<Farm, "id">) => setFarms([...farms, { ...f, id: "f_" + uid() }]),
    update: (id: string, patch: Partial<Farm>) =>
      setFarms(farms.map((f) => (f.id === id ? { ...f, ...patch } : f))),
    remove: (id: string) => setFarms(farms.filter((f) => f.id !== id)),
  };
}

export function useRecords(ownerId?: string) {
  const [records, setRecords] = useStore<LedgerEntry[]>(KEYS.records, []);
  const list = ownerId ? records.filter((r) => r.ownerId === ownerId) : records;
  return {
    records: list,
    add: (r: Omit<LedgerEntry, "id">) => setRecords([...records, { ...r, id: "r_" + uid() }]),
    update: (id: string, patch: Partial<LedgerEntry>) =>
      setRecords(records.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    remove: (id: string) => setRecords(records.filter((r) => r.id !== id)),
  };
}

export function useApplications(farmerId?: string) {
  const [apps, setApps] = useStore<Application[]>(KEYS.apps, []);
  const list = farmerId ? apps.filter((a) => a.farmerId === farmerId) : apps;
  return {
    applications: list,
    add: (a: Omit<Application, "id">) => setApps([...apps, { ...a, id: "a_" + uid() }]),
    update: (id: string, patch: Partial<Application>) =>
      setApps(apps.map((a) => (a.id === id ? { ...a, ...patch } : a))),
    remove: (id: string) => setApps(apps.filter((a) => a.id !== id)),
  };
}

export function computeCreditScore(records: LedgerEntry[], farms: Farm[]): number {
  const revenue = records.filter((r) => r.type === "revenue").reduce((s, r) => s + r.amount, 0);
  const expense = records.filter((r) => r.type === "expense").reduce((s, r) => s + r.amount, 0);
  const margin = revenue - expense;
  const diversity = new Set(farms.map((f) => f.crop)).size;
  const base = 45;
  const marginScore = Math.min(35, Math.max(0, margin / 30));
  const diversityScore = Math.min(10, diversity * 5);
  const recordScore = Math.min(10, records.length * 1.5);
  return Math.round(Math.min(95, base + marginScore + diversityScore + recordScore));
}

export function aiRecommendations(farms: Farm[], records: LedgerEntry[]): string[] {
  const recs: string[] = [];
  const revenue = records.filter((r) => r.type === "revenue").reduce((s, r) => s + r.amount, 0);
  const expense = records.filter((r) => r.type === "expense").reduce((s, r) => s + r.amount, 0);
  if (revenue < expense)
    recs.push("Expenses exceed revenue — review input costs and consider bulk seed purchase via co-op.");
  if (new Set(farms.map((f) => f.crop)).size < 2)
    recs.push("Diversify crops: intercrop legumes (beans) with maize to improve soil nitrogen.");
  if (farms.some((f) => f.irrigation === "Rain-fed"))
    recs.push("Rain-fed plots are exposed to dry spells — consider low-cost drip irrigation.");
  if (records.length < 5) recs.push("Add more transaction records to strengthen your credit profile.");
  recs.push("Apply organic compost before next planting to lift yields by an estimated 12–18%.");
  return recs;
}

export function riskProfile(farms: Farm[]) {
  const rainfed = farms.filter((f) => f.irrigation === "Rain-fed").length;
  const climate = Math.min(90, 40 + rainfed * 15);
  const market = 55;
  const pest = 35;
  return { climate, market, pest, overall: Math.round((climate + market + pest) / 3) };
}
