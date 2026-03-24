export interface TransactionInput {
  id: string;
  amount: number;
}

export interface BalanceResponse {
  shotgun_user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface TopupResponse {
  shotgun_user_id: string;
  balance: number;
  message: string;
}

export interface PayResponse {
  shotgun_user_id: string;
  balance: number;
  message: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

export type ApiError = {
  message: string;
  code?: string;
  statusCode: number;
};
