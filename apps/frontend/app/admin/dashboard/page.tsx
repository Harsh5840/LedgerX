"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Users, AlertTriangle, RotateCcw, TrendingUp, Shield, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  // Remove dashboardData and related loading/error
  // const [dashboardData, setDashboardData] = useState<any>(null)
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  // State for all users and transactions
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [allTransactions, setAllTransactions] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(true)

  // Remove dashboardData fetch useEffect

  // Fetch all users
  useEffect(() => {
    setUsersLoading(true)
    const fetchUsers = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setAllUsers(Array.isArray(data) ? data : [])
      setUsersLoading(false)
    }
    fetchUsers()
  }, [])

  // Fetch all transactions
  useEffect(() => {
    setTransactionsLoading(true)
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/transactions/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setAllTransactions(Array.isArray(data) ? data : [])
      setTransactionsLoading(false)
    }
    fetchTransactions()
  }, [])

  // Remove dashboardData loading/error checks

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole="ADMIN" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="ADMIN" userName="Admin User" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* All Users Table */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>List of all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div>Loading users...</div>
              ) : (
                <div className="space-y-2">
                  {allUsers.map(user => (
                    <div key={user.id} className="flex justify-between border-b py-2">
                      <span>{user.name} ({user.email})</span>
                      <span>{user.status}</span>
                    </div>
                  ))}
                  {allUsers.length === 0 && <div>No users found.</div>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Transactions Table */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>List of all transactions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div>Loading transactions...</div>
              ) : (
                <div className="space-y-2">
                  {allTransactions.map(tx => (
                    <div key={tx.id} className="flex justify-between border-b py-2">
                      <span>{tx.id} - {tx.description}</span>
                      <span>${tx.amount}</span>
                      <span>{tx.status}</span>
                    </div>
                  ))}
                  {allTransactions.length === 0 && <div>No transactions found.</div>}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
