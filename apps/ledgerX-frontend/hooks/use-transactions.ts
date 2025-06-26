import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Transaction, CreateTransactionInput, TransactionResponse } from '@/types/transaction';
import { toast } from 'sonner';

export function useTransactions(searchTerm?: string, categoryFilter?: string) { //this function is used to get all transactions
  const queryClient = useQueryClient();

  const { data: transactions, isLoading, error } = useQuery<Transaction[]>({    
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx client errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      // Retry up to 3 times on other errors
      return failureCount < 3;
    },
    queryKey: ['transactions', searchTerm, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);

      try {
        const backendUrl = "https://localhost:5000";
        if (!backendUrl) {
          throw new Error('BACKEND_URL environment variable is not set');
        }
        const response = await axios.get(`${backendUrl}/api/transactions/all?${params.toString()}`);
        if (!response.data) {
          throw new Error('No data received from server');
        }
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          throw new Error('Please sign in to view transactions');
        } else if (error.response?.status === 403) {
          throw new Error('You do not have permission to view transactions');
        } else if (error.response?.status >= 500) {
          throw new Error('Server error. Please try again later');
        } else {
          throw new Error(error.response?.data?.message || error.message || 'Failed to fetch transactions');
        }
      }
    },
  });

  const createTransaction = useMutation<TransactionResponse, Error, CreateTransactionInput>({
    mutationFn: async (input) => {
      if (!input.fromAccount || !input.toAccount || !input.amount || !input.description) {
        throw new Error('All fields are required');
      }
      if (input.fromAccount === input.toAccount) {
        throw new Error('From and To accounts must be different');
      }
      if (parseFloat(input.amount.toString()) <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      const response = await axios.post('/api/transactions/create', input);
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
    mutationFn: async (transactionId) => {
      const response = await axios.post(`/api/transactions/reverse/${transactionId}`);
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
