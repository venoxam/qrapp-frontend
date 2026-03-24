import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postPay } from '../services/api';
import type { TransactionInput, PayResponse, ApiError } from '../types/api';

export function usePay() {
  const queryClient = useQueryClient();

  return useMutation<PayResponse, ApiError, TransactionInput>({
    mutationFn: postPay,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['balance', data.shotgun_user_id] });
    },
  });
}
