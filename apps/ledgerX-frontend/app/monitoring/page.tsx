"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, AlertTriangle, Eye, CheckCircle, X, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// Mock data for risk monitoring
const mockRiskTransactions = [
  {
    id: "1",
    transactionId: "tx_001",
    fromAccount: "Checking Account",
    toAccount: "Unknown ATM",
    amount: 2500.00,
    timestamp: "2024-01-15T23:45:00Z",
    riskLevel: "HIGH" as const,
    riskFactors: ["Large cash withdrawal", "Late night transaction", "Unusual location"],
    status: "PENDING",
    hash: "a1b2c3d4e5f6789",
    flaggedAt: "2024-01-15T23:46:00Z",
  },
  {
    id: "2", 
    transactionId: "tx_002",
    fromAccount: "Credit Card",
    toAccount: "Online Merchant XYZ",
    amount: 599.99,
    timestamp: "2024-01-15T18:30:00Z",
    riskLevel: "MEDIUM" as const,
    riskFactors: ["New merchant", "High-value purchase", "Different location"],
    status: "REVIEWED",
    hash: "f6e5d4c3b2a1098",
    flaggedAt: "2024-01-15T18:31:00Z",
    reviewedBy: "admin@example.com",
    reviewedAt: "2024-01-15T20:00:00Z",
  },
  {
    id: "3",
    transactionId: "tx_003", 
    fromAccount: "Checking Account",
    toAccount: "Gas Station",
    amount: 150.00,
    timestamp: "2024-01-14T02:15:00Z",
    riskLevel: "MEDIUM" as const,
    riskFactors: ["Late night transaction", "Above average amount"],
    status: "CLEARED",
    hash: "9z8y7x6w5v4u321",
    flaggedAt: "2024-01-14T02:16:00Z",
    reviewedBy: "admin@example.com",
    reviewedAt: "2024-01-14T09:30:00Z",
  },
  {
    id: "4",
    transactionId: "tx_004",
    fromAccount: "Checking Account", 
    toAccount: "International Transfer",
    amount: 5000.00,
    timestamp: "2024-01-13T16:20:00Z",
    riskLevel: "CRITICAL" as const,
    riskFactors: ["International transfer", "Large amount", "New beneficiary"],
    status: "BLOCKED",
    hash: "u4v5w6x7y8z9012",
    flaggedAt: "2024-01-13T16:21:00Z",
    blockedBy: "system",
    blockedAt: "2024-01-13T16:21:00Z",
  },
];

export default function Monitoring() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard");
    }
  }, [isAdmin, router]);

  const { data: riskData, isLoading } = useQuery({
    queryKey: ["risk-monitoring", selectedStatus],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filtered = mockRiskTransactions;
      if (selectedStatus !== "ALL") {
        filtered = mockRiskTransactions.filter(tx => tx.status === selectedStatus);
      }
      
      return {
        transactions: filtered,
        summary: {
          total: mockRiskTransactions.length,
          pending: mockRiskTransactions.filter(tx => tx.status === "PENDING").length,
          reviewed: mockRiskTransactions.filter(tx => tx.status === "REVIEWED").length,
          blocked: mockRiskTransactions.filter(tx => tx.status === "BLOCKED").length,
          cleared: mockRiskTransactions.filter(tx => tx.status === "CLEARED").length,
        }
      };
    },
    enabled: isAdmin,
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "bg-red-500";
      case "HIGH": return "bg-red-400";
      case "MEDIUM": return "bg-yellow-500";
      case "LOW": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500";
      case "REVIEWED": return "bg-blue-500";
      case "CLEARED": return "bg-green-500";
      case "BLOCKED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleReviewTransaction = async (transactionId: string, action: "approve" | "block") => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Transaction ${action === "approve" ? "approved" : "blocked"} successfully`);
    } catch (error) {
      toast.error("Failed to update transaction status");
    }
  };

  const handleReverseTransaction = async (transactionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Transaction reversed successfully");
    } catch (error) {
      toast.error("Failed to reverse transaction");
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Shield className="mr-3 h-8 w-8 text-primary" />
            Risk Monitoring
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage high-risk transactions and suspicious activities
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Flagged</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{riskData?.summary.total}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <div className="h-4 w-4 bg-yellow-500 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{riskData?.summary.pending}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
                <div className="h-4 w-4 bg-blue-500 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{riskData?.summary.reviewed}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked</CardTitle>
                <div className="h-4 w-4 bg-red-500 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{riskData?.summary.blocked}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cleared</CardTitle>
                <div className="h-4 w-4 bg-green-500 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{riskData?.summary.cleared}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Status Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["ALL", "PENDING", "REVIEWED", "BLOCKED", "CLEARED"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Flagged Transactions</CardTitle>
            <CardDescription>
              {riskData?.transactions.length || 0} transactions requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {riskData?.transactions.map((transaction, index) => (
                <AccordionItem key={transaction.id} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center space-x-4">
                        <Badge className={`${getRiskColor(transaction.riskLevel)} text-white`}>
                          {transaction.riskLevel}
                        </Badge>
                        <div className="text-left">
                          <p className="font-medium">{transaction.fromAccount} → {transaction.toAccount}</p>
                          <p className="text-sm text-muted-foreground">
                            ${transaction.amount.toFixed(2)} • {format(new Date(transaction.timestamp), "MMM dd, yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="font-medium">Transaction ID</label>
                          <p className="text-muted-foreground font-mono">{transaction.transactionId}</p>
                        </div>
                        <div>
                          <label className="font-medium">Hash</label>
                          <p className="text-muted-foreground font-mono">{transaction.hash}</p>
                        </div>
                        <div>
                          <label className="font-medium">Flagged At</label>
                          <p className="text-muted-foreground">
                            {format(new Date(transaction.flaggedAt), "MMM dd, yyyy HH:mm:ss")}
                          </p>
                        </div>
                        <div>
                          <label className="font-medium">Amount</label>
                          <p className="text-muted-foreground font-mono">${transaction.amount.toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <label className="font-medium text-sm">Risk Factors</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {transaction.riskFactors.map((factor, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {(transaction.reviewedBy || transaction.blockedBy) && (
                        <div className="border-t pt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {transaction.reviewedBy && (
                              <>
                                <div>
                                  <label className="font-medium">Reviewed By</label>
                                  <p className="text-muted-foreground">{transaction.reviewedBy}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Reviewed At</label>
                                  <p className="text-muted-foreground">
                                    {transaction.reviewedAt && format(new Date(transaction.reviewedAt), "MMM dd, yyyy HH:mm")}
                                  </p>
                                </div>
                              </>
                            )}
                            {transaction.blockedBy && (
                              <>
                                <div>
                                  <label className="font-medium">Blocked By</label>
                                  <p className="text-muted-foreground">{transaction.blockedBy}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Blocked At</label>
                                  <p className="text-muted-foreground">
                                    {transaction.blockedAt && format(new Date(transaction.blockedAt), "MMM dd, yyyy HH:mm")}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 pt-4 border-t">
                        {transaction.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleReviewTransaction(transaction.id, "approve")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReviewTransaction(transaction.id, "block")}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Block
                            </Button>
                          </>
                        )}
                        
                        {transaction.status !== "BLOCKED" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reverse
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}