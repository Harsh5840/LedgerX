"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Wallet,
  PieChart,
  Activity,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

interface Transaction {
  id: number
  description: string
  amount: number
  category: string
  date: string
  status: string
}

interface CategorySummary {
  [category: string]: number
}

export default function UserDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [riskAlerts, setRiskAlerts] = useState<number>(0)

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const txRes = await fetch("http://localhost:5000/api/transactions/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const txData = await txRes.json();

      if (!Array.isArray(txData)) {
        // Handle error: API did not return an array (likely unauthorized or error response)
        setTransactions([]);
        setBalance(0);
        setCategoryData([]);
        setMonthlyData([]);
        setRiskAlerts(0);
        // Optionally, you can log or display an error message here
        console.error("Failed to fetch transactions:", txData);
        return;
      }

      setTransactions(txData);

      // Balance = sum of all transaction amounts
      const totalBalance = txData.reduce((acc: number, tx: Transaction) => acc + tx.amount, 0);
      setBalance(totalBalance);

      // Category Breakdown
      const categorySummary: CategorySummary = {};
      txData.forEach((tx: Transaction) => {
        categorySummary[tx.category] = (categorySummary[tx.category] || 0) + Math.abs(tx.amount);
      });

      const total = Object.values(categorySummary).reduce((a, b) => a + b, 0);
      const colors = ["#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#f1f5f9"];
      const formattedCategoryData = Object.entries(categorySummary).map(([key, value], i) => ({
        name: key,
        value: ((value / total) * 100).toFixed(1),
        color: colors[i % colors.length],
      }));
      setCategoryData(formattedCategoryData);

      // Monthly trend
      const monthlyMap: { [key: string]: number } = {};
      txData.forEach((tx: Transaction) => {
        // Only include expenses (negative amounts)
        if (tx.amount < 0) {
          const dateObj = new Date(tx.date);
          const monthKey = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`; // e.g., "2024-7"
          monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + Math.abs(tx.amount);
        }
      });

      // Sort months chronologically
      const sortedMonths = Object.keys(monthlyMap).sort();
      const formattedMonthlyData = sortedMonths.map((monthKey) => {
        const [year, month] = monthKey.split("-");
        const monthName = new Date(Number(year), Number(month) - 1).toLocaleString("default", { month: "short" });
        return {
          month: `${monthName} ${year}`,
          spending: parseFloat(monthlyMap[monthKey].toFixed(2)),
        };
      });
      setMonthlyData(formattedMonthlyData);

      // Risk Alerts (basic rule: any tx > 1000 is "risky")
      const alerts = txData.filter((tx: Transaction) => Math.abs(tx.amount) > 1000).length;
      setRiskAlerts(alerts);
    }

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole="USER" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="USER" userName="John Doe" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Good morning, John! 👋</h1>
            <p className="text-slate-600 dark:text-slate-400">Here’s your financial overview for today</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Wallet />} label="Current Balance" value={`$${balance.toFixed(2)}`} trend="up" />
            <StatCard
              icon={<Activity />}
              label="This Month's Spending"
              value={`$${monthlyData.at(-1)?.spending || 0}`}
              trend="down"
            />
            <StatCard
              icon={<AlertTriangle className="text-yellow-600" />}
              label="Risk Alerts"
              value={riskAlerts.toString()}
              color="text-yellow-600"
            />
          </div>

          {/* AI Assistant & Transactions Section (replace charts) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentTransactions transactions={transactions.slice(0, 5)} />
            </div>
            <AssistantCard />
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, trend = "neutral", color = "text-green-600" }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row justify-between pb-2">
        <CardTitle className="text-sm text-slate-600 dark:text-slate-400">{label}</CardTitle>
        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
        {Icon && (
          <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center mt-1">
            <Icon className={`h-3 w-3 mr-1 ${color}`} />
            <span className={color}>+2.5%</span> from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function LineChartCard({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trend</CardTitle>
        <CardDescription>Your spending pattern over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="spending" stroke="#64748b" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function PieChartCard({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Where your money goes this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} dataKey="value">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span>{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  // Helper to determine if a transaction is an expense
  function isExpense(tx: Transaction) {
    return tx.amount < 0;
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((tx) => {
          const expense = isExpense(tx);
          return (
            <div key={tx.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    expense
                      ? "bg-red-100 dark:bg-red-900"
                      : "bg-green-100 dark:bg-green-900"
                  }`}
                >
                  {expense ? (
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{tx.description}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {tx.category} • {tx.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${expense ? "text-red-600" : "text-green-600"}`}>
                  {expense ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                </p>
                <Badge
                  variant={tx.status === "completed" ? "default" : "secondary"}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {tx.status}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  )
}

function AssistantCard() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAsk = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/nlp/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
      })
      const data = await res.json()
      if (data.success) {
        setResponse(
          data.total !== undefined
            ? `Total: $${data.total}`
            : data.categories
            ? `Top categories: ${data.categories.map((c: any) => c.name + ' ($' + c.total + ')').join(', ')}`
            : data.message || "No answer."
        )
      } else {
        setResponse(data.message || "Sorry, I couldn't understand your question.")
      }
    } catch (e) {
      setError("Failed to contact AI service.")
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>Ask about your spending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="What's my grocery spend this month?"
              className="flex-1"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAsk() }}
              disabled={loading}
            />
            <Button size="icon" onClick={handleAsk} disabled={loading || !input}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg min-h-[48px]">
            {loading && <span className="text-sm text-slate-500">Thinking...</span>}
            {error && <span className="text-sm text-red-500">{error}</span>}
            {response && <span className="text-sm text-slate-700 dark:text-slate-300">{response}</span>}
            {!response && !loading && !error && (
              <p className="text-sm text-slate-700 dark:text-slate-300">
                💡 Try asking: "Show my largest expenses this week" or "How much on entertainment?"
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
