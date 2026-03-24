import { useQuery } from '@tanstack/react-query';
import { fetchBalance } from '../services/api';
import type { BalanceResponse, ApiError } from '../types/api';

export function useBalance(id: string | null) {
  return useQuery<BalanceResponse, ApiError>({
    queryKey: ['balance', id],
    queryFn: () => fetchBalance(id!),
    enabled: !!id,
    retry: false,
    staleTime: 10_000,
  });
}
