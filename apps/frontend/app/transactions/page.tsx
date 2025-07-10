"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import {
  Search,
  Download,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  AlertCircle,
  CheckCircle2,
  Plus
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Update the Transaction interface to match the actual backend data
interface Transaction {
  id: string;
  description: string | null;
  amount: number;
  type: string;
  timestamp: string;
  createdAt: string;
  userId: string;
  riskScore: number;
  isFlagged: boolean;
  reasons: string[];
  parentId: string | null;
  ledgerEntries: any[];
}


type Account = {
  id: string; 
  name: string;
  type: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, settypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "",
    accountId: "",
    debitAccountId: "",
    creditAccountId: "",
    from: "",
    to: "",
    timestamp: ""
  })

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Description', 'Amount', 'Type', 'type', 'Date'],
      ...transactions.map(t => [
        t.id,
        t.description || 'N/A',
        t.amount.toString(),
        t.type || 'N/A',         // if you want to display transaction type
        t.type,
        new Date(t.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCreateTransaction = async () => {
    if (!formData.description || !formData.amount || !formData.type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.type === "transfer" && (!formData.from || !formData.to)) {
      toast({
        title: "Validation Error",
        description: "Please select both 'from' and 'to' accounts for transfers",
        variant: "destructive"
      });
      return;
    }

    if (formData.type !== "transfer" && !formData.from) {
      toast({
        title: "Validation Error",
        description: "Please select an account",
        variant: "destructive"
      });
      return;
    }

    if (!formData.timestamp) {
      toast({
        title: "Validation Error",
        description: "Please select a date/time for the transaction",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Missing JWT token");
      }

      const payload =
        formData.type === "transfer"
          ? {
              amount: parseFloat(formData.amount),
              from: formData.from,
              to: formData.to,
              type: formData.type, // FIXED from `type` → `type`
              description: formData.description,
              timestamp: formData.timestamp
            }
          : {
              amount: parseFloat(formData.amount),
              from: formData.from,
              to: "",
              type: formData.type, // FIXED
              description: formData.description,
              timestamp: formData.timestamp
            };

      const response = await axios.post("http://localhost:5000/api/transactions/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Success!",
        description: "Transaction created successfully",
      });

      resetForm();
      setShowCreateDialog(false);
      fetchTransactions();
    } catch (err: any) {
      console.error("Transaction creation error:", err);
      toast({
        title: "Error creating transaction",
        description: err.response?.data?.error || "Failed to create transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      type: "",
      accountId: "",
      debitAccountId: "",
      creditAccountId: "",
      from: "",
      to: "",
      timestamp: ""
    })
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Missing JWT token")
      }

      const res = await axios.get("http://localhost:5000/api/transactions/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Fetched transactions:", res.data)
      if (res.data && res.data.length > 0) {
        console.log("First transaction sample:", res.data[0])
        console.log("First transaction keys:", Object.keys(res.data[0]))
        console.log("Description field value:", res.data[0].description)
        console.log("All fields in first transaction:", JSON.stringify(res.data[0], null, 2))
      }
      setTransactions(res.data)
    } catch (err: any) {
      console.error("Fetch error:", err)
      const errorMessage = err.response?.status === 404 
        ? "No transactions found for this user"
        : "Could not fetch transaction data. Please ensure you're logged in."
      
      setError(errorMessage)
      toast({
        title: "Error loading transactions",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/accounts/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(Array.isArray(res.data) ? res.data : res.data.accounts);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      }
    };
    fetchAccounts();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (transaction.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (transaction.type?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchestype = typeFilter === "all" || transaction.type === typeFilter

    return matchesSearch && matchestype
  })

  const handleViewDetails = (transactionId: string) => {
    toast({
      title: "Transaction Details",
      description: `Viewing details for transaction ${transactionId}`,
    })
  }

  // Update the transaction display to handle the actual data structure
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'expense':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'transfer':
        return <ArrowLeftRight className="h-4 w-4 text-blue-600" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 dark:bg-green-900'
      case 'expense':
        return 'bg-red-100 dark:bg-red-900'
      case 'transfer':
        return 'bg-blue-100 dark:bg-blue-900'
      default:
        return 'bg-muted'
    }
  }

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600'
      case 'expense':
        return 'text-red-600'
      case 'transfer':
        return 'text-blue-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const absAmount = Math.abs(amount)
    const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : ''
    return `${prefix}$${absAmount.toFixed(2)}`
  }

  const uniqueCategories = [...new Set(transactions.map(t => t.type))]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="USER" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="USER" userName="John Doe" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Transactions</h1>
                <p className="text-muted-foreground">
                  View and manage your financial transactions
                </p>
              </div>
              <Button 
                onClick={fetchTransactions} 
                variant="outline" 
                className="flex items-center space-x-2"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          {/* Remove the income and expense cards, keep only total transactions */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold text-foreground">
                      {filteredTransactions.length}
                    </p>
                  </div>
                  <ArrowLeftRight className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions, descriptions, or categories..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={typeFilter} onValueChange={settypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleExport}
                  variant="outline" 
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Transaction History</span>
                    {filteredTransactions.length > 0 && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    {loading ? 'Loading...' : `${filteredTransactions.length} transactions found`}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {filteredTransactions.length} / {transactions.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {transactions.length === 0 ? 'No transactions found' : 'No transactions match your search criteria'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent/50 transition-all duration-200 border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${getTransactionColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-bold text-lg text-foreground">
                              {transaction.description || `Transaction #${transaction.id.slice(-6)}`}
                            </p>
                            <Badge variant="outline" className="text-xs font-mono">
                              {transaction.id.slice(-8)}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {transaction.type}
                            </Badge>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                            <span>{new Date(transaction.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`font-bold text-lg ${getAmountColor(transaction.type)}`}>
                            {formatAmount(transaction.amount, transaction.type)}
                          </p>
                          <Badge 
                            variant="outline"
                            className={`text-xs capitalize ${
                              transaction.type === 'income' ? 'border-green-300 text-green-700' :
                              transaction.type === 'expense' ? 'border-red-300 text-red-700' :
                              'border-blue-300 text-blue-700'
                            }`}
                          >
                            {transaction.type}
                          </Badge>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(transaction.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={() => { setShowCreateDialog(true); resetForm(); }} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Transaction
          </Button>

          <Dialog open={showCreateDialog} onOpenChange={open => { setShowCreateDialog(open); if (!open) resetForm(); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Transaction</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleCreateTransaction();
                }}
                className="space-y-4"
              >
                <Input
                  placeholder="Description"
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  required
                />
                <Input
                  placeholder="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData(f => ({ ...f, amount: e.target.value }))}
                  required
                />
                <Select
                  value={formData.type}
                  onValueChange={value => setFormData(f => ({ ...f, type: value, accountId: "", debitAccountId: "", creditAccountId: "", from: "", to: "", timestamp: "" }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                {formData.type === "income" || formData.type === "expense" ? (
                  <Select
                    value={formData.from}
                    onValueChange={value => setFormData(f => ({ ...f, from: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc: Account) => (
                        <SelectItem key={acc.id} value={acc.name}>{acc.name} ({acc.type})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}
                {formData.type === "transfer" ? (
                  <div className="flex gap-2">
                    <Select
                      value={formData.from}
                      onValueChange={value => setFormData(f => ({ ...f, from: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="From Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((acc: Account) => (
                          <SelectItem key={acc.id} value={acc.name}>{acc.name} ({acc.type})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.to}
                      onValueChange={value => setFormData(f => ({ ...f, to: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="To Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((acc: Account) => (
                          <SelectItem key={acc.id} value={acc.name}>{acc.name} ({acc.type})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
                <div>
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.timestamp}
                    onChange={e => setFormData(f => ({ ...f, timestamp: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}