"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, AlertTriangle, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ComposedChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const [total, setTotal] = useState<number | null>(null);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [flagged, setFlagged] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("1month"); // default to last month

  // Helper to get month/year for 'last month'
  function getMonthYearForRange(range: string) {
    const now = new Date();
    if (range === "1month") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return { month: lastMonth.getMonth() + 1, year: lastMonth.getFullYear() };
    }
    // Add logic for other ranges if needed
    return {};
  }

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const { month, year } = getMonthYearForRange(timeRange);

        // Total Spending
        const totalRes = await axios.get("http://localhost:5000/api/analytics/total", {
          params: { month, year }, // userId removed
          ...config,
        });
        setTotal(totalRes.data.total);
        console.log(totalRes.data.total);

        // Top Categories
        const catRes = await axios.get("http://localhost:5000/api/analytics/top-categories", {
          params: { month, year }, // userId removed
          ...config,
        });
        setTopCategories(catRes.data.categories);
        console.log(catRes.data.categories);

        // Monthly Trend (usually for all months, but you can filter if needed)
        const trendRes = await axios.get("http://localhost:5000/api/analytics/monthly-trend", {
          params: {}, // userId removed
          ...config,
        });
        setMonthlyTrend(trendRes.data.trend);
        console.log(trendRes.data.trend);
        // Flagged/Risky
        const flaggedRes = await axios.get("http://localhost:5000/api/analytics/flagged", {
          params: {}, // userId removed
          ...config,
        });
        setFlagged(flaggedRes.data.flagged);
        console.log(flaggedRes.data.flagged);
      } catch (err: any) {
        console.log("Error fetching analytics:", err);
        setError("Could not fetch analytics data.");
        toast({
          title: "Error loading analytics",
          description: err?.response?.data?.error || "Could not fetch analytics data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    console.log("token", token);
    if (token) fetchAnalytics();
  }, [token, timeRange]);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being generated...",
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole="USER" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="USER" userName="John Doe" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400">Insights into your financial patterns and trends</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {loading ? "Loading..." : total !== null ? `$${total.toLocaleString()}` : "No data"}
                </div>
                <p className="text-xs text-muted-foreground">(Filtered by user)</p>
              </CardContent>
            </Card>
            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>Loading...</div>
                ) : topCategories.length === 0 ? (
                  <div>No data</div>
                ) : (
                  <RechartsPieChart width={300} height={200}>
                    <Pie
                      data={topCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="total"
                    >
                      {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 50}, 70%, 50%)`} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                )}
                <div className="mt-4 space-y-2">
                  {topCategories.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 50}, 70%, 50%)` }} />
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">${item.total}</span>
                        {item.percentage && <span className="text-xs text-muted-foreground ml-2">({item.percentage}%)</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : monthlyTrend.length === 0 ? (
                <div>No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Flagged/Risky Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Flagged or Risky Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : flagged.length === 0 ? (
                <div>No flagged or risky entries.</div>
              ) : (
                <div className="space-y-2">
                  {flagged.map((entry, idx) => (
                    <div key={idx} className="p-3 rounded bg-yellow-50 dark:bg-yellow-900/20 flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-semibold">{entry.description || entry.reason || 'Flagged Entry'}</div>
                        <div className="text-xs text-muted-foreground">Risk Score: {entry.riskScore}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}