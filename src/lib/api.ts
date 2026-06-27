const BASE = import.meta.env.VITE_API_URL ?? "https://mavuno-api-production.up.railway.app";

// Shared types

export type Role = "farmer" | "lender";

// Auth types

export interface User {
  userId: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  region?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  region?: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Farmer types (mirrors backend FarmerSummary / FarmerDetail)

export interface FarmerSummary {
  farmerId: string;
  fullName: string;
  gender: string;
  phone: string;
  status: string;
  consentGiven: boolean;
  nationalId: string;
  idType: string;
  creditScore?: number;
  readinessLevel?: string;
  county?: string;
}

export interface FarmOut {
  farmId: string;
  farmName: string;
  sizeAcres: number;
  ownershipType: string;
  county?: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  cropsGrown: string[];
  createdAt?: string;
}

export interface CreditProfileOut {
  scoreId: string;
  score: number;
  readinessLevel: string;
  confidenceLevel: number;
  updatedAt?: string;
  risks: { riskId: string; category: string; severity: string; description: string }[];
  recommendations: {
    recommendationId: string;
    title: string;
    description: string;
    priority: string;
  }[];
}

export interface FinancialProfileOut {
  profileId: string;
  totalRevenue: number;
  totalExpenses: number;
  cashFlowScore: number;
  computedAt?: string;
}

export interface ProductionRecordOut {
  productionId: string;
  productionDate?: string;
  quantity: number;
  unit: string;
  season: string;
  cropName?: string;
  sales: {
    saleId: string;
    quantity: number;
    amount: number;
    currency: string;
    buyerType: string;
    buyerName: string;
    hasEvidence: boolean;
    createdAt?: string;
  }[];
}

export interface LoanHistoryOut {
  loanId: string;
  lenderName: string;
  lenderType: string;
  loanAmount: number;
  repaidAmount: number;
  currency: string;
  isOnTime: boolean;
  status: string;
  startDate?: string;
  closedDate?: string;
}

// Lender types

export interface LenderApplicantOut {
  farmerId: string;
  fullName: string;
  creditScore?: number;
  readinessLevel?: string;
  appliedAt?: string;
}

// Token storage

export const tokens = {
  getAccess: () => localStorage.getItem("access_token"),
  getRefresh: () => localStorage.getItem("refresh_token"),
  set: (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  },
  clear: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

// Core fetch wrapper

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authenticated) {
    const token = tokens.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.detail ?? "Request failed.");
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Auth

export const authApi = {
  register: (payload: RegisterPayload) =>
    request<AuthResponse>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(payload) },
      false,
    ),

  login: (payload: LoginPayload) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }, false),

  me: () => request<User>("/auth/me"),

  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
};

// Farmers

export const farmerApi = {
  // GET /farmers/
  list: () => request<FarmerSummary[]>("/farmers/"),

  // GET /farmers/{farmer_id}
  get: (farmerId: string) => request<FarmerSummary>(`/farmers/${farmerId}`),

  // GET /farmers/{farmer_id}/farms
  farms: (farmerId: string) => request<FarmOut[]>(`/farmers/${farmerId}/farms`),

  // GET /farmers/{farmer_id}/credit-profile
  creditProfile: (farmerId: string) =>
    request<CreditProfileOut>(`/farmers/${farmerId}/credit-profile`),

  // GET /farmers/{farmer_id}/financial-profile
  financialProfile: (farmerId: string) =>
    request<FinancialProfileOut>(`/farmers/${farmerId}/financial-profile`),

  // GET /farmers/{farmer_id}/production
  production: (farmerId: string) =>
    request<ProductionRecordOut[]>(`/farmers/${farmerId}/production`),

  // GET /farmers/{farmer_id}/loan-history
  loanHistory: (farmerId: string) => request<LoanHistoryOut[]>(`/farmers/${farmerId}/loan-history`),
};

// Lenders

export const lenderApi = {
  // GET /lenders/{lender_id}/applicants
  applicants: (lenderId: string) =>
    request<LenderApplicantOut[]>(`/lenders/${lenderId}/applicants`),
};
