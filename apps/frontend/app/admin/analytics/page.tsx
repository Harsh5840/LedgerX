"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Shield,
  AlertTriangle,
  Download,
  PieChartIcon,
  Globe,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("volume")
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    setError(null)
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/admin/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (data) {
          setAnalyticsData(data)
        } else {
          setError("Failed to load analytics data: Invalid response format.")
        }
      } catch (e) {
        setError("Failed to load analytics data.")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (!analyticsData) {
    return <div className="text-center py-8">No data available.</div>
  }

  const currentMonth = analyticsData.systemMetrics[analyticsData.systemMetrics.length - 1]
  const previousMonth = analyticsData.systemMetrics[analyticsData.systemMetrics.length - 2]

  const volumeChange = (((currentMonth.volume - previousMonth.volume) / previousMonth.volume) * 100).toFixed(1)
  const transactionChange = (
    ((currentMonth.transactions - previousMonth.transactions) / previousMonth.transactions) *
    100
  ).toFixed(1)
  const userChange = (((currentMonth.users - previousMonth.users) / previousMonth.users) * 100).toFixed(1)
  const revenueChange = (((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1)

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your admin analytics report is being generated...",
    })
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
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">System Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Comprehensive insights into platform performance and usage
              </p>
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
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentMonth.volume.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`flex items-center ${Number.parseFloat(volumeChange) > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {Number.parseFloat(volumeChange) > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {volumeChange}% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMonth.transactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`flex items-center ${Number.parseFloat(transactionChange) > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {Number.parseFloat(transactionChange) > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {transactionChange}% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMonth.users.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`flex items-center ${Number.parseFloat(userChange) > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {Number.parseFloat(userChange) > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {userChange}% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentMonth.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`flex items-center ${Number.parseFloat(revenueChange) > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {Number.parseFloat(revenueChange) > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {revenueChange}% from last month
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="risk">Risk & Security</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Volume Trends */}
                <Card className="neumorphic border-0">
                  <CardHeader>
                    <CardTitle>System Volume Trends</CardTitle>
                    <CardDescription>Transaction volume and revenue over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.systemMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="volume"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.3}
                        />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Transaction Types */}
                <Card className="neumorphic border-0">
                  <CardHeader>
                    <CardTitle>Transaction Distribution</CardTitle>
                    <CardDescription>Breakdown by transaction type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.transactionTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analyticsData.transactionTypes.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {analyticsData.transactionTypes.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card className="neumorphic border-0">
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time system health indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {analyticsData.performanceMetrics.map((metric: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{metric.metric}</h4>
                          <Badge
                            variant={
                              metric.status === "excellent"
                                ? "default"
                                : metric.status === "good"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {metric.status}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold mb-1">{metric.value}</p>
                        <div className="flex items-center space-x-1 text-xs">
                          {metric.change > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : metric.change < 0 ? (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          ) : (
                            <div className="h-3 w-3" />
                          )}
                          <span
                            className={
                              metric.change > 0
                                ? "text-green-600"
                                : metric.change < 0
                                  ? "text-red-600"
                                  : "text-muted-foreground"
                            }
                          >
                            {metric.change > 0 ? "+" : ""}
                            {metric.change}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Breakdown */}
              <Card className="neumorphic border-0">
                <CardHeader>
                  <CardTitle>Revenue Sources</CardTitle>
                  <CardDescription>Monthly revenue breakdown by source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.revenueBreakdown.map((source: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{source.source}</h4>
                          <div className="text-right">
                            <span className="text-sm font-medium">${source.amount.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground ml-2">({source.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500 transition-all"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <Card className="neumorphic border-0">
                  <CardHeader>
                    <CardTitle>User Growth Trends</CardTitle>
                    <CardDescription>New users and retention metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="newUsers" fill="#3B82F6" />
                        <Line yAxisId="right" type="monotone" dataKey="churnRate" stroke="#EF4444" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Geographic Distribution */}
                <Card className="neumorphic border-0">
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>Users and volume by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.geographicData.map((region: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{region.region}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">{region.users.toLocaleString()} users</span>
                              <span className="text-xs text-muted-foreground ml-2">({region.percentage}%)</span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-green-500 transition-all"
                              style={{ width: `${region.percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">Volume: ${region.volume.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="neumorphic border-0">
                <CardHeader>
                  <CardTitle>Transaction Analytics</CardTitle>
                  <CardDescription>Detailed transaction patterns and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={analyticsData.systemMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="transactions" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Distribution */}
                <Card className="neumorphic border-0">
                  <CardHeader>
                    <CardTitle>Risk Assessment Distribution</CardTitle>
                    <CardDescription>Transaction risk categorization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.riskMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {analyticsData.riskMetrics.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{item.count.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground ml-2">({item.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Security Alerts */}
                <Card className="neumorphic border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-red-600" />
                      <span>Security Alerts</span>
                    </CardTitle>
                    <CardDescription>Recent security incidents and alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-red-800 dark:text-red-200">
                              High Risk Transaction Detected
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                              Unusual transaction pattern detected for user ID: 12345
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400 mt-2">2 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                              Multiple Failed Login Attempts
                            </h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                              5 failed login attempts from IP: 192.168.1.100
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">4 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start space-x-3">
                          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Security Update Applied</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              Fraud detection algorithm updated successfully
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analyticsData.performanceMetrics.map((metric: any, index: number) => (
                  <Card key={index} className="neumorphic border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{metric.metric}</span>
                        <Badge
                          variant={
                            metric.status === "excellent"
                              ? "default"
                              : metric.status === "good"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {metric.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">{metric.value}</div>
                      <div className="flex items-center space-x-2">
                        {metric.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : metric.change < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                        <span
                          className={`text-sm ${
                            metric.change > 0
                              ? "text-green-600"
                              : metric.change < 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                          }`}
                        >
                          {metric.change > 0 ? "+" : ""}
                          {metric.change}% from last period
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
