"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, CreditCard, ArrowRight, Brain } from "lucide-react";
import { toast } from "sonner";
import { TRANSACTION_CATEGORIES } from '@/types/transaction';

const transactionSchema = z.object({
  fromAccount: z.string().min(1, "From account is required"),
  toAccount: z.string().min(1, "To account is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  description: z.string().min(1, "Description is required"),
});

type TransactionForm = z.infer<typeof transactionSchema>;

const mockAccounts = [
  "Checking Account",
  "Savings Account", 
  "Credit Card",
  "Investment Account",
  "Business Account",
];

const mockMerchants = [
  "Amazon",
  "Starbucks",
  "Shell Gas Station",
  "Walmart",
  "Target",
  "McDonald's",
  "Uber",
  "Netflix",
];

export default function NewTransaction() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [aiCategory, setAiCategory] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      fromAccount: "",
      toAccount: "",
      amount: "",
      description: "",
    },
  });

  const classifyTransaction = async (description: string, amount: string) => {
    // Simple mock logic based on description
    let category = "others";
    const desc = description.toLowerCase();
    
    if (desc.includes("coffee") || desc.includes("restaurant") || desc.includes("food")) {
      category = "food";
    } else if (desc.includes("amazon") || desc.includes("shopping") || desc.includes("store")) {
      category = "shopping";
    } else if (desc.includes("gas") || desc.includes("uber") || desc.includes("transport")) {
      category = "transport";
    } else if (desc.includes("rent") || desc.includes("mortgage")) {
      category = "housing";
    } else if (desc.includes("movie") || desc.includes("game")) {
      category = "entertainment";
    } else if (desc.includes("doctor") || desc.includes("medicine") || desc.includes("healthcare")) {
      category = "health";
    } else if (desc.includes("electricity") || desc.includes("water") || desc.includes("internet")) {
      category = "utilities";
    } else if (desc.includes("flight") || desc.includes("hotel")) {
      category = "travel";
    } else if (desc.includes("tuition") || desc.includes("course") || desc.includes("book")) {
      category = "education";
    } else if (desc.includes("stock") || desc.includes("bond") || desc.includes("crypto")) {
      category = "investment";
    }
    
    return category;
  };

  const generateHash = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const onSubmit = async (data: TransactionForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate AI categorization
      await new Promise(resolve => setTimeout(resolve, 1500));
      const category = await classifyTransaction(data.description, data.amount);
      setAiCategory(category);
      
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      const hash = generateHash();
      setTransactionHash(hash);
      
      setTransactionSuccess(true);
      toast.success("Transaction processed successfully!");
      
      // Redirect after showing success
      setTimeout(() => {
        router.push("/transactions");
      }, 3000);
      
    } catch (error) {
      toast.error("Failed to process transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (transactionSuccess) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-green-500/20 bg-green-50/10">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto mb-4"
                >
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </motion.div>
                <CardTitle className="text-2xl text-green-500">Transaction Successful!</CardTitle>
                <CardDescription>
                  Your transaction has been processed and added to the ledger
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium">From</label>
                    <p className="text-muted-foreground">{form.getValues("fromAccount")}</p>
                  </div>
                  <div>
                    <label className="font-medium">To</label>
                    <p className="text-muted-foreground">{form.getValues("toAccount")}</p>
                  </div>
                  <div>
                    <label className="font-medium">Amount</label>
                    <p className="text-muted-foreground font-mono">${form.getValues("amount")}</p>
                  </div>
                  <div>
                    <label className="font-medium">AI Category</label>
                    <Badge variant="secondary" className="mt-1">
                      <Brain className="mr-1 h-3 w-3" />
                      {aiCategory}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <label className="font-medium">Transaction Hash</label>
                    <p className="text-muted-foreground font-mono text-xs bg-muted/50 p-2 rounded mt-1">
                      {transactionHash}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Redirecting to transactions page...
                  </p>
                  <Button onClick={() => router.push("/transactions")}>
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Transaction</h1>
          <p className="text-muted-foreground">
            Create a new financial transaction with AI-powered categorization
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Transaction Details
            </CardTitle>
            <CardDescription>
              Enter the transaction information. The category will be automatically detected using AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fromAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Account</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockAccounts.map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="toAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Account/Merchant</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...mockAccounts, ...mockMerchants].map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the transaction amount in USD
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter transaction description..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the transaction. This will be used for AI categorization.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Brain className="mr-2 h-4 w-4 text-primary" />
                    Category will be automatically detected
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Create Transaction
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}