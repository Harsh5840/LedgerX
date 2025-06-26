"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Filter, RotateCcw, Eye, Plus } from "lucide-react";
import { CreateTransaction } from "@/components/transactions/create-transaction";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { TRANSACTION_CATEGORIES } from "@/types/transaction";

// Mock data


export default function Transactions() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const { transactions, isLoading, error, reverseTransaction } = useTransactions(searchTerm, categoryFilter);

  const handleReverseTransaction = async (transactionId: string) => {
    try {
      await reverseTransaction.mutateAsync(transactionId);
      toast.success('Transaction reversed successfully');
    } catch (error) {
      console.error('Transaction reversal failed:', error);
      toast.error('Failed to reverse transaction. Please try again.');
    }
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
        {/* Filters */}
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
                    {TRANSACTION_CATEGORIES.map(category => (
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

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {transactions?.length || 0} transactions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
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
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <CreateTransaction />
            </div>
            ) : !transactions?.length ? (
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>No transactions found</p>
                  {(searchTerm || categoryFilter !== 'all') && (
                    <p className="text-sm mt-2">
                      Try adjusting your search or filter criteria
                    </p>
                  )}
                </div>
                <CreateTransaction />
              </div>
            ) : (
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
                  {transactions?.map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group"
                    >
                      <TableCell className="font-medium">
                        {format(new Date(transaction.timestamp), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{transaction.fromAccount}</TableCell>
                      <TableCell>{transaction.toAccount}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-mono ${
                        transaction.amount >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {transaction.amount >= 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {transaction.reversed ? (
                          <Badge variant="destructive">Reversed</Badge>
                        ) : (
                          <Badge variant="default">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>
                                  Complete transaction information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">From Account</label>
                                    <p className="text-sm text-muted-foreground">{transaction.fromAccount}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">To Account</label>
                                    <p className="text-sm text-muted-foreground">{transaction.toAccount}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Amount</label>
                                    <p className={`text-sm font-mono ${
                                      transaction.amount >= 0 ? "text-green-500" : "text-red-500"
                                    }`}>
                                      ${Math.abs(transaction.amount).toFixed(2)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Category</label>
                                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium">Hash</label>
                                    <p className="text-sm text-muted-foreground font-mono">{transaction.hash}</p>
                                  </div>
                                </div>
                                {transaction.reversed && (
                                  <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium text-red-500 mb-2">Reversal Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Reversed By</label>
                                        <p className="text-sm text-muted-foreground">{transaction.reversedBy}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Reversed At</label>
                                        <p className="text-sm text-muted-foreground">
                                          {transaction.reversedAt && format(new Date(transaction.reversedAt), "MMM dd, yyyy HH:mm")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {isAdmin && !transaction.reversed && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reverse Transaction</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reverse this transaction? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => handleReverseTransaction(transaction.id)}
                                    disabled={reverseTransaction.isPending}
                                  >
                                    {reverseTransaction.isPending ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Reversing...
                                      </>
                                    ) : (
                                      'Reverse Transaction'
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}