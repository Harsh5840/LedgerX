"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Search, Filter, RotateCcw, Eye, Plus, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

// Mock data
const mockTransactions = [
  {
    id: "1",
    fromAccount: "Checking Account",
    toAccount: "Coffee Shop",
    amount: -4.50,
    category: "Food & Dining",
    description: "Morning coffee",
    timestamp: "2024-01-15T08:30:00Z",
    hash: "a1b2c3d4e5f6789",
    reversed: false,
  },
  {
    id: "2", 
    fromAccount: "Salary Account",
    toAccount: "Checking Account",
    amount: 2500.00,
    category: "Income",
    description: "Monthly salary",
    timestamp: "2024-01-15T00:00:00Z",
    hash: "f6e5d4c3b2a1098",
    reversed: false,
  },
  {
    id: "3",
    fromAccount: "Checking Account", 
    toAccount: "Amazon",
    amount: -89.99,
    category: "Shopping",
    description: "Electronics purchase",
    timestamp: "2024-01-14T16:45:00Z",
    hash: "9z8y7x6w5v4u321",
    reversed: false,
  },
  {
    id: "4",
    fromAccount: "Checking Account",
    toAccount: "Gas Station",
    amount: -55.20,
    category: "Transportation",
    description: "Fuel",
    timestamp: "2024-01-14T12:20:00Z", 
    hash: "u4v5w6x7y8z9012",
    reversed: true,
    reversedBy: "admin@example.com",
    reversedAt: "2024-01-14T18:00:00Z",
  },
];

export default function Transactions() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", searchTerm, categoryFilter],
    queryFn: async () => {
      // Simulate API call with filters
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTransactions.filter(tx => {
        const matchesSearch = searchTerm === "" || 
          tx.fromAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.toAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.hash.includes(searchTerm);
        
        const matchesCategory = categoryFilter === "" || tx.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
      });
    },
  });

  const handleReverseTransaction = async (transactionId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Transaction reversed successfully");
    } catch (error) {
      toast.error("Failed to reverse transaction");
    }
  };

  const categories = [...new Set(mockTransactions.map(tx => tx.category))];

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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchTerm || categoryFilter) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("");
                  }}
                >
                  Clear
                </Button>
              )}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                                  >
                                    Reverse Transaction
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