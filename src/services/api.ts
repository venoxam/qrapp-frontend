import type {
  TransactionInput,
  BalanceResponse,
  TopupResponse,
  PayResponse,
  ApiError,
} from "../types/api";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    const err: ApiError = {
      message: (body as { error?: string }).error ?? "Request failed",
      code: (body as { code?: string }).code,
      statusCode: res.status,
    };
    throw err;
  }
  return res.json() as Promise<T>;
}

export async function fetchBalance(id: string): Promise<BalanceResponse> {
  const res = await fetch(`${BASE_URL}/balance/${encodeURIComponent(id)}`);
  return handleResponse<BalanceResponse>(res);
}

export async function postTopup(
  input: TransactionInput,
): Promise<TopupResponse> {
  const res = await fetch(`${BASE_URL}/topup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<TopupResponse>(res);
}

export async function postPay(input: TransactionInput): Promise<PayResponse> {
  const res = await fetch(`${BASE_URL}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<PayResponse>(res);
}
