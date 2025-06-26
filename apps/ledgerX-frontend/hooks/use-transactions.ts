import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Transaction, CreateTransactionInput, TransactionResponse } from '@/types/transaction';
import { toast } from 'sonner';

export function useTransactions(searchTerm?: string, categoryFilter?: string) {
  const queryClient = useQueryClient();

  const { data: transactions, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ['transactions', searchTerm, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);

      const response = await axios.get(`http://localhost:5000/api/transactions?${params.toString()}`);
      return response.data;
    },
  });

  const createTransaction = useMutation<TransactionResponse, Error, CreateTransactionInput>({
    mutationFn: async (input) => {
      const response = await axios.post('http://localhost:5000/api/transactions/create', input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to create transaction');
    },
  });

  const reverseTransaction = useMutation<TransactionResponse, Error, string>({
    mutationFn: async (hash) => {
      const response = await axios.post(`http://localhost:5000/api/reversal/${hash}/reverse`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction reversed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to reverse transaction');
    },
  });

  return {
    transactions,
    isLoading,
    error,
    createTransaction,
    reverseTransaction,
  };
}
