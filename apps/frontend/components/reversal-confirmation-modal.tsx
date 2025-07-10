"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, RotateCcw } from "lucide-react"

interface ReversalConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (confirmationCode: string) => void
  transaction: {
    id: string
    amount: number
    user: {
      name: string
      email: string
    }
    description: string
  }
  isProcessing?: boolean
}

export function ReversalConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  isProcessing = false,
}: ReversalConfirmationModalProps) {
  const [confirmationCode, setConfirmationCode] = useState("")
  const [step, setStep] = useState<"verify" | "confirm">("verify")

  // Generate a random confirmation code (in real app, this would come from backend)
  const expectedCode = "REV-" + Math.random().toString(36).substr(2, 6).toUpperCase()

  const handleVerify = () => {
    if (confirmationCode === expectedCode) {
      setStep("confirm")
    }
  }

  const handleConfirm = () => {
    onConfirm(confirmationCode)
    setConfirmationCode("")
    setStep("verify")
  }

  const handleClose = () => {
    setConfirmationCode("")
    setStep("verify")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>{step === "verify" ? "Verify Reversal Request" : "Final Confirmation"}</span>
          </DialogTitle>
          <DialogDescription>
            {step === "verify"
              ? "Enter the confirmation code to proceed with the reversal"
              : "This action cannot be undone. Please confirm one final time."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Summary */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Transaction Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <p className="font-medium">{transaction.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <p className="font-medium text-red-600">${transaction.amount.toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">User:</span>
                <p className="font-medium">{transaction.user.name}</p>
                <p className="text-xs text-muted-foreground">{transaction.user.email}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Description:</span>
                <p className="font-medium">{transaction.description}</p>
              </div>
            </div>
          </div>

          {step === "verify" ? (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Confirmation Code:</strong> {expectedCode}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    In production, this would be sent via secure channel
                  </span>
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="confirmationCode">Enter Confirmation Code</Label>
                <Input
                  id="confirmationCode"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                  placeholder="REV-XXXXXX"
                  className="font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>Final Warning:</strong> This will immediately reverse the transaction and notify the user. The
                  action cannot be undone and will be permanently logged in the audit trail.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-center space-x-2">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  ✓ Code Verified
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Ready to Process
                </Badge>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>

          {step === "verify" ? (
            <Button
              onClick={handleVerify}
              disabled={confirmationCode !== expectedCode}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Verify Code
            </Button>
          ) : (
            <Button onClick={handleConfirm} disabled={isProcessing} className="bg-red-600 hover:bg-red-700 text-white">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Confirm Reversal
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
