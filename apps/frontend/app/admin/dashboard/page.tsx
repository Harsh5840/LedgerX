"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Users, AlertTriangle, RotateCcw, TrendingUp, Shield, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const systemVolumeData = [
  { month: "Jan", volume: 124000, transactions: 2400 },
  { month: "Feb", volume: 139800, transactions: 1398 },
  { month: "Mar", volume: 198000, transactions: 9800 },
  { month: "Apr", volume: 139080, transactions: 3908 },
  { month: "May", volume: 148000, transactions: 4800 },
  { month: "Jun", volume: 138000, transactions: 3800 },
]

const riskData = [
  { category: "Low Risk", count: 1247, color: "#64748b" },
  { category: "Medium Risk", count: 234, color: "#94a3b8" },
  { category: "High Risk", count: 89, color: "#cbd5e1" },
  { category: "Critical", count: 12, color: "#e2e8f0" },
]

const flaggedTransactions = [
  {
    id: "TXN001",
    user: "john.doe@email.com",
    amount: 15000,
    reason: "Large amount",
    timestamp: "2024-01-15 14:30",
    risk: "high",
  },
  {
    id: "TXN002",
    user: "jane.smith@email.com",
    amount: 500,
    reason: "Unusual pattern",
    timestamp: "2024-01-15 13:45",
    risk: "medium",
  },
  {
    id: "TXN003",
    user: "bob.wilson@email.com",
    amount: 25000,
    reason: "Velocity check",
    timestamp: "2024-01-15 12:20",
    risk: "critical",
  },
  {
    id: "TXN004",
    user: "alice.brown@email.com",
    amount: 750,
    reason: "Location anomaly",
    timestamp: "2024-01-15 11:15",
    risk: "medium",
  },
]

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole="ADMIN" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="ADMIN" userName="Admin User" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Good morning, Admin! 🛡️</h1>
            <p className="text-slate-600 dark:text-slate-400">System overview and security monitoring</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</CardTitle>
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">50,847</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600">+180</span>
                  <span className="ml-1">new this month</span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Transactions Today
                </CardTitle>
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">59,000</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center mt-1">
                  <Activity className="h-3 w-3 mr-1 text-blue-600" />
                  <span className="text-blue-600">+5.2%</span>
                  <span className="ml-1">from yesterday</span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Flagged Activity
                </CardTitle>
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">23</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Requires review</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Reversals Requested
                </CardTitle>
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <RotateCcw className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">7</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Pending approval</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* System Volume Chart */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">System-wide Monthly Volume</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Transaction volume and count over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={systemVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                    <Line type="monotone" dataKey="volume" stroke="#64748b" strokeWidth={2} name="Volume ($)" />
                    <Line type="monotone" dataKey="transactions" stroke="#94a3b8" strokeWidth={2} name="Count" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Risk Assessment Summary</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Current risk distribution across transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="category" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                    <Bar dataKey="count" fill="#64748b" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {riskData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{item.category}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Flagged Transactions */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Recent Flagged Transactions</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Transactions requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-l-4 border-l-red-500"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
                        <Shield className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{transaction.id}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{transaction.user}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{transaction.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-semibold text-red-600">${transaction.amount.toLocaleString()}</p>
                      <Badge
                        variant={
                          transaction.risk === "critical"
                            ? "destructive"
                            : transaction.risk === "high"
                              ? "destructive"
                              : "secondary"
                        }
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {transaction.risk}
                      </Badge>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{transaction.reason}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-transparent"
                      >
                        Review
                      </Button>
                      <Button size="sm" variant="destructive">
                        Block
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
