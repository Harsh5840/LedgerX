'use client';

import { useState } from 'react';
import { TRANSACTION_CATEGORIES, TransactionCategory } from '@/types/transaction';
import { useTransactions } from '@/hooks/use-transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function CreateTransaction() {
  const [open, setOpen] = useState(false);
  const { createTransaction } = useTransactions();

  const [formData, setFormData] = useState<{
    fromAccount: string;
    toAccount: string;
    amount: string;
    description: string;
    category: TransactionCategory;
  }>({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    category: TRANSACTION_CATEGORIES[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fromAccount.trim()) {
      toast.error('From account is required');
      return;
    }
    if (!formData.toAccount.trim()) {
      toast.error('To account is required');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (formData.fromAccount === formData.toAccount) {
      toast.error('From and To accounts must be different');
      return;
    }

    try {
      await createTransaction.mutateAsync({
        fromAccount: formData.fromAccount.trim(),
        toAccount: formData.toAccount.trim(),
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category: formData.category
      });

      setOpen(false);
      setFormData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
        category: TRANSACTION_CATEGORIES[0]
      });
    } catch (error) {
      console.error('Transaction creation failed:', error);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from">From Account</Label>
            <Input
              id="fromAccount"
              value={formData.fromAccount}
              onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To Account</Label>
            <Input
              id="toAccount"
              value={formData.toAccount}
              onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as TransactionCategory })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTransaction.isPending}
              className="min-w-[100px]"
            >
              {createTransaction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}