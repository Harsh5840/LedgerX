"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Shield, User, CreditCard, Hash, Calendar, ArrowLeft, RotateCcw, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Mock transaction data - in real app this would come from API
const getTransactionByHash = (hash: string) => {
  const transactions = {
    abc123def456: {
      id: "TXN001",
      hash: "abc123def456",
      user: {
        id: "user_123",
        name: "John Doe",
        email: "john.doe@email.com",
        accountNumber: "****1234",
      },
      amount: 1250.0,
      description: "Large Purchase - Electronics Store",
      category: "Shopping",
      status: "completed",
      timestamp: "2024-01-15 14:30:22",
      merchantInfo: {
        name: "TechWorld Electronics",
        id: "MERCHANT_789",
        location: "New York, NY",
      },
      paymentMethod: "Credit Card ****5678",
      riskScore: 85,
      flags: ["Large Amount", "New Merchant"],
      previousReversals: 0,
      canReverse: true,
      reversalDeadline: "2024-01-22 14:30:22",
    },
    def456ghi789: {
      id: "TXN002",
      hash: "def456ghi789",
      user: {
        id: "user_456",
        name: "Jane Smith",
        email: "jane.smith@email.com",
        accountNumber: "****5678",
      },
      amount: 3500.0,
      description: "Salary Deposit",
      category: "Income",
      status: "completed",
      timestamp: "2024-01-15 13:45:10",
      merchantInfo: {
        name: "ABC Corporation",
        id: "MERCHANT_456",
        location: "San Francisco, CA",
      },
      paymentMethod: "Direct Deposit",
      riskScore: 15,
      flags: [],
      previousReversals: 0,
      canReverse: false,
      reversalDeadline: null,
      reversalBlockedReason: "Income transactions cannot be reversed",
    },
  }

  return transactions[hash as keyof typeof transactions] || null
}

export default function TransactionReversalPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [transaction, setTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reversalReason, setReversalReason] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [confirmationChecks, setConfirmationChecks] = useState({
    verifiedTransaction: false,
    contactedUser: false,
    documentedReason: false,
    understoodConsequences: false,
  })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch transaction
    setTimeout(() => {
      const txn = getTransactionByHash(params.hash as string)
      setTransaction(txn)
      setLoading(false)
    }, 1000)
  }, [params.hash])

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setConfirmationChecks((prev) => ({
      ...prev,
      [key]: checked,
    }))
  }

  const allChecksCompleted = Object.values(confirmationChecks).every(Boolean)
  const canProceed = allChecksCompleted && reversalReason.trim().length >= 20 && adminPassword.trim().length > 0

  const handleInitiateReversal = () => {
    if (!canProceed) {
      toast({
        title: "Incomplete Requirements",
        description: "Please complete all required fields and confirmations",
        variant: "destructive",
      })
      return
    }
    setShowConfirmDialog(true)
  }

  const handleConfirmReversal = async () => {
    setIsProcessing(true)
    setShowConfirmDialog(false)

    // Simulate reversal process
    setTimeout(() => {
      toast({
        title: "Reversal Initiated Successfully",
        description: `Transaction ${transaction.id} reversal has been processed and logged`,
      })

      // In real app, would redirect to reversal confirmation page
      router.push("/admin/transactions")
      setIsProcessing(false)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar userRole="ADMIN" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar userRole="ADMIN" userName="Admin User" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading transaction details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar userRole="ADMIN" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar userRole="ADMIN" userName="Admin User" />
          <main className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The transaction with hash {params.hash} could not be found.
                </p>
                <Button onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole="ADMIN" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="ADMIN" userName="Admin User" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Transaction Reversal</h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Secure reversal workflow for transaction {transaction.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Alert */}
            {!transaction.canReverse ? (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>Reversal Blocked:</strong> {transaction.reversalBlockedReason}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                <Shield className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  <strong>Security Notice:</strong> This action will permanently reverse the transaction and cannot be
                  undone. Reversal deadline: {new Date(transaction.reversalDeadline).toLocaleString()}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Details */}
            <div className="space-y-6">
              <Card className="neumorphic border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Transaction Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Transaction ID</Label>
                      <p className="font-mono text-sm">{transaction.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                      <p className="text-lg font-semibold text-red-600">${transaction.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p>{transaction.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant="default">{transaction.status}</Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Timestamp</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{transaction.timestamp}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Transaction Hash</Label>
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {transaction.hash}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Information */}
              <Card className="neumorphic border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>User Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p>{transaction.user.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p>{transaction.user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account</Label>
                    <p>{transaction.user.accountNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                    <p>{transaction.paymentMethod}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="neumorphic border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Risk Score</Label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            transaction.riskScore > 70
                              ? "bg-red-500"
                              : transaction.riskScore > 40
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${transaction.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{transaction.riskScore}/100</span>
                    </div>
                  </div>

                  {transaction.flags.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Risk Flags</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {transaction.flags.map((flag: string, index: number) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Previous Reversals</Label>
                    <p>{transaction.previousReversals} reversals</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reversal Form */}
            <div className="space-y-6">
              {transaction.canReverse ? (
                <>
                  <Card className="neumorphic border-0">
                    <CardHeader>
                      <CardTitle>Reversal Requirements</CardTitle>
                      <CardDescription>Complete all requirements before proceeding</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="verified"
                            checked={confirmationChecks.verifiedTransaction}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("verifiedTransaction", checked as boolean)
                            }
                          />
                          <Label htmlFor="verified" className="text-sm">
                            I have verified the transaction details are correct
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="contacted"
                            checked={confirmationChecks.contactedUser}
                            onCheckedChange={(checked) => handleCheckboxChange("contactedUser", checked as boolean)}
                          />
                          <Label htmlFor="contacted" className="text-sm">
                            I have contacted the user regarding this reversal
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="documented"
                            checked={confirmationChecks.documentedReason}
                            onCheckedChange={(checked) => handleCheckboxChange("documentedReason", checked as boolean)}
                          />
                          <Label htmlFor="documented" className="text-sm">
                            I have documented the reason for reversal below
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="consequences"
                            checked={confirmationChecks.understoodConsequences}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("understoodConsequences", checked as boolean)
                            }
                          />
                          <Label htmlFor="consequences" className="text-sm">
                            I understand this action cannot be undone
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="neumorphic border-0">
                    <CardHeader>
                      <CardTitle>Reversal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="reason">Reason for Reversal *</Label>
                        <Textarea
                          id="reason"
                          placeholder="Provide a detailed explanation for why this transaction needs to be reversed..."
                          value={reversalReason}
                          onChange={(e) => setReversalReason(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Minimum 20 characters ({reversalReason.length}/20)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="password">Admin Password Confirmation *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your admin password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="neumorphic border-0 border-red-200 bg-red-50 dark:bg-red-950">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold text-red-800 dark:text-red-200">Danger Zone</h3>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        This action will immediately reverse the transaction and cannot be undone. The user will be
                        notified and funds will be returned to their account.
                      </p>
                      <Button
                        onClick={handleInitiateReversal}
                        disabled={!canProceed || isProcessing}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing Reversal...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Initiate Transaction Reversal
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="neumorphic border-0">
                  <CardContent className="p-6 text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Reversal Not Available</h3>
                    <p className="text-muted-foreground">{transaction.reversalBlockedReason}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Confirm Transaction Reversal</span>
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please review the details one final time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Transaction:</span>
                  <p className="font-medium">{transaction.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium text-red-600">${transaction.amount.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">User:</span>
                  <p className="font-medium">
                    {transaction.user.name} ({transaction.user.email})
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                The reversal will be logged in the audit trail and the user will be automatically notified.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReversal} className="bg-red-600 hover:bg-red-700 text-white">
              <RotateCcw className="h-4 w-4 mr-2" />
              Confirm Reversal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
