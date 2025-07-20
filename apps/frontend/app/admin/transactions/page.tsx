"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Search, Download, ArrowUpRight, ArrowDownRight, MoreHorizontal, Eye, RotateCcw, History } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ReversalConfirmationModal } from "@/components/reversal-confirmation-modal"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showReversalModal, setShowReversalModal] = useState(false)
  const [isProcessingReversal, setIsProcessingReversal] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    setError(null)
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/transactions/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (Array.isArray(data)) {
          setTransactions(data)
        } else {
          setError("Failed to load transactions: Invalid response format.")
        }
      } catch (e) {
        setError("Failed to load transactions.")
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleQuickReversal = (transaction: any) => {
    if (!transaction.canReverse) {
      toast({
        title: "Reversal Not Available",
        description: "This transaction cannot be reversed",
        variant: "destructive",
      })
      return
    }

    setSelectedTransaction(transaction)
    setShowReversalModal(true)
  }

  const handleDetailedReversal = (hash: string) => {
    router.push(`/admin/reversal/${hash}`)
  }

  const handleConfirmReversal = async (confirmationCode: string) => {
    setIsProcessingReversal(true)

    // Simulate reversal process
    setTimeout(() => {
      toast({
        title: "Reversal Completed",
        description: `Transaction ${selectedTransaction.id} has been successfully reversed`,
      })

      setShowReversalModal(false)
      setSelectedTransaction(null)
      setIsProcessingReversal(false)
    }, 2000)
  }

  const handleViewDetails = (transactionId: string) => {
    toast({
      title: "Transaction Details",
      description: `Viewing details for transaction ${transactionId}`,
    })
  }

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 70) {
      return (
        <Badge variant="destructive" className="text-xs">
          High Risk
        </Badge>
      )
    } else if (riskScore >= 40) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
          Medium Risk
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">Low Risk</Badge>
      )
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole="ADMIN" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="ADMIN" userName="Admin User" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Admin Transactions</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage all system transactions with reversal capabilities
              </p>
            </div>
            <Link href="/admin/reversal/history">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <History className="h-4 w-4" />
                <span>Reversal History</span>
              </Button>
            </Link>
          </div>

          {/* Filters and Search */}
          <Card className="neumorphic border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search transactions, users, or IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                  </SelectContent>
                </Select>

                {/* Export Button */}
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="neumorphic border-0">
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading transactions...</p>
                  </div>
                )}
                {error && (
                  <div className="text-center py-12 text-red-500">
                    <p>{error}</p>
                  </div>
                )}
                {!loading && !error && filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${transaction.amount > 0 ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
                      >
                        {transaction.amount > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium">{transaction.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.id}
                          </Badge>
                          {getRiskBadge(transaction.riskScore)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>User:</strong> {transaction.user.name} ({transaction.user.email})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category} • {transaction.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center space-x-2">
                        {transaction.canReverse && transaction.status === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickReversal(transaction)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Quick Reverse
                          </Button>
                        )}

                        {/* More Actions */}
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
                            {transaction.canReverse && transaction.status === "completed" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleDetailedReversal(transaction.hash)}
                                  className="text-red-600"
                                >
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Detailed Reversal
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTransactions.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No transactions found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Quick Reversal Modal */}
      {selectedTransaction && (
        <ReversalConfirmationModal
          isOpen={showReversalModal}
          onClose={() => {
            setShowReversalModal(false)
            setSelectedTransaction(null)
          }}
          onConfirm={handleConfirmReversal}
          transaction={selectedTransaction}
          isProcessing={isProcessingReversal}
        />
      )}
    </div>
  )
}
