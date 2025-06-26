"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Filter, RotateCcw, Eye, Plus } from "lucide-react";
import { CreateTransaction } from "@/components/transactions/create-transaction";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { TRANSACTION_CATEGORIES } from "@/types/transaction";
import { Transaction, LedgerEntry } from "@ledgerX/db";
import type { DualEntryTransaction } from "@/types/transaction";



// Component for displaying transaction filters
interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

function TransactionFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
}: TransactionFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions, accounts, or hash..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {TRANSACTION_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchTerm || categoryFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
              >
                Clear
              </Button>
            )}
          </div>
          <CreateTransaction />
        </div>
      </CardContent>
    </Card>
  );
}

// Component for displaying transaction details in a dialog
interface TransactionDetailsDialogProps {
  selectedTransaction: DualEntryTransaction | null;
}

function TransactionDetailsDialog({ selectedTransaction }: TransactionDetailsDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogDescription>
          View the complete details of the selected transaction.
        </DialogDescription>
      </DialogHeader>
      {selectedTransaction && (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">ID:</p>
            <p className="col-span-3 text-sm">{selectedTransaction.id}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">Debit Account:</p>
            <p className="col-span-3 text-sm">{selectedTransaction.debit.accountId}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">Debit Amount:</p>
            <p className="col-span-3 text-sm">${selectedTransaction.debit.amount.toFixed(2)}</p>
            </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">Credit Account:</p>
            <p className="col-span-3 text-sm">{selectedTransaction.credit.accountId}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">Credit Amount:</p>
            <p className="col-span-3 text-sm">${selectedTransaction.credit.amount.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">Category:</p>
            <p className="col-span-3 text-sm">{selectedTransaction.debit.category || selectedTransaction.credit.category}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">Timestamp:</p>
            <p className="col-span-3 text-sm">{format(new Date(selectedTransaction.debit.timestamp), 'PPP p')}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">Debit Reversal:</p>
            <p className="col-span-3 text-sm">{selectedTransaction.debit.isReversal ? 'Yes' : 'No'}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">Credit Reversal:</p>
            <p className="col-span-3 text-sm">{selectedTransaction.credit.isReversal ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </DialogContent>
  );
}

// Component for transaction reversal confirmation
interface TransactionReversalDialogProps {
  tx: Transaction;
  isAdmin: boolean;
  isReversed: boolean;
  handleReverseTransaction: (transactionId: string) => Promise<void>;
  isReversing: boolean;
}

function TransactionReversalDialog({
  tx,
  isAdmin,
  isReversed,
  handleReverseTransaction,
  isReversing,
}: TransactionReversalDialogProps) {
  if (!isAdmin || isReversed) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-600"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reverse Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            This will create a new reversal entry for both debit and credit. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={() => handleReverseTransaction(tx.id)}
            disabled={isReversing}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Main Transactions Page Component
export default function Transactions() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
 const [selectedTransaction, setSelectedTransaction] = useState<DualEntryTransaction | null>(null);


  const isAdmin = (session?.user as any)?.role === "ADMIN";

const { transactions, isLoading, error, reverseTransaction } =
  useTransactions(searchTerm, categoryFilter);
  const handleReverseTransaction = async (transactionId: string) => {
    try {
      await reverseTransaction.mutateAsync(transactionId);
      toast.success('Transaction reversed successfully');
    } catch (error) {
      console.error('Transaction reversal failed:', error);
      toast.error('Failed to reverse transaction. Please try again.');
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-red-500 mb-2">
            <svg
              className="h-8 w-8 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!transactions?.length) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-muted-foreground mb-2">
            <svg
              className="h-8 w-8 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 0 01.707.293l5.414 5.414a1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>No transactions found</p>
            {(searchTerm || categoryFilter !== 'all') && (
              <p className="text-sm mt-2">
                Try adjusting your search or filter criteria
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const debit = tx as unknown as LedgerEntry;
            const credit = tx as unknown as LedgerEntry;
            const isReversed = debit.isReversal || credit.isReversal;

            return (
              <motion.tr
                key={debit.hash + credit.hash}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group"
              >
                <TableCell className="font-medium">
                  {format(new Date(debit.timestamp), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{debit.accountId}</TableCell>
                <TableCell>{credit.accountId}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{debit.category}</Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-mono ${debit.amount >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {debit.amount >= 0 ? "+" : "-"}${Math.abs(debit.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  {isReversed ? (
                    <Badge variant="destructive">Reversed</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(tx as any)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <TransactionDetailsDialog selectedTransaction={selectedTransaction} />
                    </Dialog>

                    <TransactionReversalDialog
                      tx={tx}
                      isAdmin={isAdmin}
                      isReversed={isReversed}
                      handleReverseTransaction={handleReverseTransaction}
                      isReversing={reverseTransaction.isPending}
                    />
                  </div>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all financial transactions
            </p>
          </div>
          <Link href="/transactions/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </Link>
        </div>

        <TransactionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {transactions?.length || 0} transactions found
            </CardDescription>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}