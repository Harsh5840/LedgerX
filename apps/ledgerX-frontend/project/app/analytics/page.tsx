"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign } from "lucide-react";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";

// Mock data
const mockMonthlyData = [
  { month: "Jul", income: 12000, expense: 9500, net: 2500 },
  { month: "Aug", income: 14500, expense: 11200, net: 3300 },
  { month: "Sep", income: 13800, expense: 10800, net: 3000 },
  { month: "Oct", income: 15200, expense: 12100, net: 3100 },
  { month: "Nov", income: 16800, expense: 13400, net: 3400 },
  { month: "Dec", income: 18750, expense: 12450, net: 6300 },
];

const mockCategoryData = [
  { name: "Food & Dining", value: 3200, color: "#3B82F6", trend: 12 },
  { name: "Shopping", value: 2800, color: "#10B981", trend: -5 },
  { name: "Transportation", value: 1600, color: "#F59E0B", trend: 8 },
  { name: "Entertainment", value: 1200, color: "#EF4444", trend: 15 },
  { name: "Bills & Utilities", value: 1800, color: "#8B5CF6", trend: 2 },
  { name: "Healthcare", value: 850, color: "#F97316", trend: -12 },
];

const mockRiskData = [
  { date: "2024-01-15", amount: 2500, risk: "HIGH", reason: "Large cash withdrawal" },
  { date: "2024-01-14", amount: 599, risk: "MEDIUM", reason: "Unusual merchant" },
  { date: "2024-01-13", amount: 1200, risk: "MEDIUM", reason: "Late night transaction" },
];

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("6months");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", timeframe, categoryFilter],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        monthlyData: mockMonthlyData,
        categoryData: mockCategoryData,
        riskData: mockRiskData,
        summary: {
          totalIncome: 90050,
          totalExpense: 69450,
          avgMonthlySpend: 11575,
          highRiskTransactions: 3,
        }
      };
    },
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "HIGH": return "text-red-500";
      case "MEDIUM": return "text-yellow-500";
      case "LOW": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Advanced financial insights and trends
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  <AnimatedCounter 
                    value={analyticsData?.summary.totalIncome || 0} 
                    prefix="$" 
                    decimals={0}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  +18.2% from last period
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  <AnimatedCounter 
                    value={analyticsData?.summary.totalExpense || 0} 
                    prefix="$" 
                    decimals={0}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  +12.4% from last period
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Monthly Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <AnimatedCounter 
                    value={analyticsData?.summary.avgMonthlySpend || 0} 
                    prefix="$" 
                    decimals={0}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on last 6 months
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  <AnimatedCounter value={analyticsData?.summary.highRiskTransactions || 0} />
                </div>
                <p className="text-xs text-muted-foreground">
                  High-risk transactions
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Spending Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Income vs Expenses</CardTitle>
                    <CardDescription>Monthly comparison over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData?.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="income" 
                          stackId="1"
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="expense" 
                          stackId="2"
                          stroke="#EF4444" 
                          fill="#EF4444" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Net Income Trend</CardTitle>
                    <CardDescription>Monthly net income after expenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData?.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="net" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>Distribution of expenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData?.categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData?.categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Category Trends</CardTitle>
                    <CardDescription>Month-over-month change</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData?.categoryData.map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">${category.value.toLocaleString()}</span>
                            <Badge 
                              variant={category.trend >= 0 ? "destructive" : "default"}
                              className={category.trend >= 0 ? "bg-red-500" : "bg-green-500"}
                            >
                              {category.trend >= 0 ? "+" : ""}{category.trend}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                  <CardDescription>Flagged transactions requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.riskData.map((risk, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`font-bold ${getRiskColor(risk.risk)}`}>
                            {risk.risk}
                          </div>
                          <div>
                            <p className="font-medium">${risk.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{risk.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{risk.reason}</p>
                          <Badge variant="outline" className="mt-1">
                            Requires Review
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}