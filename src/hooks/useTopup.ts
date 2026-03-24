import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postTopup } from '../services/api';
import type { TransactionInput, TopupResponse, ApiError } from '../types/api';

export function useTopup() {
  const queryClient = useQueryClient();

  return useMutation<TopupResponse, ApiError, TransactionInput>({
    mutationFn: postTopup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['balance', data.shotgun_user_id] });
    },
  });
}
