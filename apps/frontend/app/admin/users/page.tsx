"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Shield,
  Ban,
  CheckCircle,
  AlertTriangle,
  Users,
  UserPlus,
  UserX,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const users = [
  {
    id: "user_001",
    name: "John Doe",
    email: "john.doe@email.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    role: "user",
    joinDate: "2023-06-15",
    lastLogin: "2024-01-15 14:30:22",
    totalTransactions: 247,
    totalVolume: 45230.5,
    riskScore: 25,
    accountsCount: 3,
    kycStatus: "verified",
    location: "New York, NY",
  },
  {
    id: "user_002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    role: "premium",
    joinDate: "2023-08-22",
    lastLogin: "2024-01-15 09:15:33",
    totalTransactions: 189,
    totalVolume: 32150.75,
    riskScore: 15,
    accountsCount: 2,
    kycStatus: "verified",
    location: "Los Angeles, CA",
  },
  {
    id: "user_003",
    name: "Bob Wilson",
    email: "bob.wilson@email.com",
    avatar: "/placeholder-user.jpg",
    status: "suspended",
    role: "user",
    joinDate: "2023-04-10",
    lastLogin: "2024-01-10 16:45:12",
    totalTransactions: 156,
    totalVolume: 28750.25,
    riskScore: 85,
    accountsCount: 1,
    kycStatus: "pending",
    location: "Chicago, IL",
  },
  {
    id: "user_004",
    name: "Alice Brown",
    email: "alice.brown@email.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    role: "business",
    joinDate: "2023-09-05",
    lastLogin: "2024-01-14 11:20:45",
    totalTransactions: 423,
    totalVolume: 125430.8,
    riskScore: 35,
    accountsCount: 5,
    kycStatus: "verified",
    location: "Austin, TX",
  },
  {
    id: "user_005",
    name: "Charlie Davis",
    email: "charlie.davis@email.com",
    avatar: "/placeholder-user.jpg",
    status: "inactive",
    role: "user",
    joinDate: "2023-11-18",
    lastLogin: "2023-12-20 08:30:15",
    totalTransactions: 23,
    totalVolume: 1250.3,
    riskScore: 10,
    accountsCount: 1,
    kycStatus: "verified",
    location: "Seattle, WA",
  },
]

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const { toast } = useToast()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesRisk =
      riskFilter === "all" ||
      (riskFilter === "low" && user.riskScore < 30) ||
      (riskFilter === "medium" && user.riskScore >= 30 && user.riskScore < 70) ||
      (riskFilter === "high" && user.riskScore >= 70)

    return matchesSearch && matchesStatus && matchesRole && matchesRisk
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "user":
        return <Badge variant="outline">User</Badge>
      case "premium":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Premium</Badge>
      case "business":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Business</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 70) {
      return (
        <Badge variant="destructive" className="text-xs">
          High Risk
        </Badge>
      )
    } else if (riskScore >= 30) {
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

  const getKycBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <Ban className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const handleUserAction = (action: string, userId: string) => {
    toast({
      title: `${action} User`,
      description: `${action} action for user ${userId}`,
    })
  }

  const activeUsers = users.filter((user) => user.status === "active").length
  const suspendedUsers = users.filter((user) => user.status === "suspended").length
  const totalVolume = users.reduce((sum, user) => sum + user.totalVolume, 0)
  const averageRisk = users.reduce((sum, user) => sum + user.riskScore, 0) / users.length

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole="ADMIN" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="ADMIN" userName="Admin User" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">User Management</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage user accounts, permissions, and security</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
              <Button className="ledger-gradient text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {((activeUsers / users.length) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All-time transaction volume</p>
              </CardContent>
            </Card>

            <Card className="neumorphic border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRisk.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Platform average</p>
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
                    placeholder="Search users by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="neumorphic border-0">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>{filteredUsers.length} users found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {user.id}
                          </Badge>
                          {getKycBadge(user.kycStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>Joined: {user.joinDate}</span>
                          <span>Last login: {user.lastLogin}</span>
                          <span>{user.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusBadge(user.status)}
                          {getRoleBadge(user.role)}
                          {getRiskBadge(user.riskScore)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">${user.totalVolume.toLocaleString()}</span> •
                          <span className="ml-1">{user.totalTransactions} txns</span> •
                          <span className="ml-1">{user.accountsCount} accounts</span>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction("View", user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction("Edit", user.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Edit Permissions
                          </DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => handleUserAction("Suspend", user.id)}
                              className="text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleUserAction("Activate", user.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleUserAction("Delete", user.id)}
                            className="text-red-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No users found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
