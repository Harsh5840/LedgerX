"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Search, Download, Eye, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function ReversalHistoryPage() {
  const [reversalHistory, setReversalHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    setLoading(true)
    setError(null)
    const fetchReversals = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/reversal/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (Array.isArray(data)) {
          setReversalHistory(data)
        } else {
          setError("Failed to load reversal history: Invalid response format.")
        }
      } catch (e) {
        setError("Failed to load reversal history.")
      } finally {
        setLoading(false)
      }
    }
    fetchReversals()
  }, [])

  const filteredReversals = reversalHistory.filter((reversal) => {
    const matchesSearch =
      reversal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reversal.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reversal.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reversal.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reversal.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reversal.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Processing</Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole="ADMIN" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="ADMIN" userName="Admin User" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Reversal History</h1>
            <p className="text-slate-600 dark:text-slate-400">Complete audit trail of all transaction reversals</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="neumorphic border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reversals</p>
                    <p className="text-2xl font-bold">247</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600">234</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processing</p>
                    <p className="text-2xl font-bold text-yellow-600">8</p>
                  </div>
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold text-red-600">5</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="neumorphic border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search reversals, transactions, users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reversal History Table */}
          <Card className="neumorphic border-0">
            <CardHeader>
              <CardTitle>Reversal Records</CardTitle>
              <CardDescription>{filteredReversals.length} reversals found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReversals.map((reversal) => (
                  <div
                    key={reversal.id}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-lg">
                          {getStatusIcon(reversal.status)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{reversal.id}</h3>
                            <Badge variant="outline" className="text-xs">
                              {reversal.transactionId}
                            </Badge>
                            {getStatusBadge(reversal.status)}
                          </div>

                          <p className="text-sm text-muted-foreground">
                            <strong>User:</strong> {reversal.user.name} ({reversal.user.email})
                          </p>

                          <p className="text-sm text-muted-foreground">
                            <strong>Admin:</strong> {reversal.admin.name}
                          </p>

                          <p className="text-sm">
                            <strong>Reason:</strong> {reversal.reason}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Initiated: {reversal.initiatedAt}</span>
                            {reversal.completedAt && <span>Completed: {reversal.completedAt}</span>}
                            {reversal.processingTime && <span>Duration: {reversal.processingTime}</span>}
                          </div>

                          {reversal.status === "failed" && reversal.failureReason && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                              <strong>Failure Reason:</strong> {reversal.failureReason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-red-600">${reversal.amount.toFixed(2)}</p>
                        </div>

                        <Link href={`/admin/reversal/${reversal.transactionHash}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredReversals.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No reversal records found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
