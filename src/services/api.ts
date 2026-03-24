import type {
  TransactionInput,
  BalanceResponse,
  TopupResponse,
  PayResponse,
  ApiError,
} from "../types/api";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
const API_KEY = import.meta.env.VITE_API_KEY ?? "";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    const b = body as { error?: string; code?: string; balance?: number };
    const err: ApiError = {
      message: b.error ?? "Request failed",
      code: b.code,
      statusCode: res.status,
      balance: b.balance,
    };
    throw err;
  }
  return res.json() as Promise<T>;
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return { ...(API_KEY ? { "X-API-Key": API_KEY } : {}), ...extra };
}

export async function fetchBalance(id: string): Promise<BalanceResponse> {
  const res = await fetch(`${BASE_URL}/balance/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });
  return handleResponse<BalanceResponse>(res);
}

export async function postTopup(
  input: TransactionInput,
): Promise<TopupResponse> {
  const res = await fetch(`${BASE_URL}/topup`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(input),
  });
  return handleResponse<TopupResponse>(res);
}

export async function postPay(input: TransactionInput): Promise<PayResponse> {
  const res = await fetch(`${BASE_URL}/pay`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(input),
  });
  return handleResponse<PayResponse>(res);
}
