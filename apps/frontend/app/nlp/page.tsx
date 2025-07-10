"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Badge } from "@/components/ui/badge"
import { Send, Brain, Sparkles, MessageCircle, TrendingUp, DollarSign, Calendar, PieChart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const sampleQueries = [
  "What's my grocery spend in June?",
  "Show me my largest expenses this week",
  "How much did I spend on entertainment?",
  "Flagged payments over $10,000 this year?",
  "Compare my spending to last month",
  "What's my average transaction amount?",
]

const mockResponses = {
  grocery: {
    query: "What's my grocery spend in June?",
    response:
      "Your grocery spending in June was $847.50 across 23 transactions. This is 12% higher than May ($756.20). Your most frequent grocery store was Whole Foods with $312.40 in purchases.",
    insights: [
      { label: "Total Spent", value: "$847.50", icon: DollarSign },
      { label: "Transactions", value: "23", icon: TrendingUp },
      { label: "Avg per Transaction", value: "$36.85", icon: PieChart },
      { label: "vs Last Month", value: "+12%", icon: Calendar },
    ],
  },
  entertainment: {
    query: "How much did I spend on entertainment?",
    response:
      "Your entertainment spending this month is $234.50 across 8 transactions. This includes streaming services ($47.97), movie tickets ($56.00), and dining out ($130.53).",
    insights: [
      { label: "Total Spent", value: "$234.50", icon: DollarSign },
      { label: "Transactions", value: "8", icon: TrendingUp },
      { label: "Streaming", value: "$47.97", icon: PieChart },
      { label: "Dining Out", value: "$130.53", icon: Calendar },
    ],
  },
  default: {
    query: "General financial query",
    response:
      "I can help you analyze your spending patterns, track expenses by category, compare monthly trends, and identify unusual transactions. Try asking about specific categories or time periods!",
    insights: [
      { label: "Total Balance", value: "$12,847.50", icon: DollarSign },
      { label: "This Month", value: "$3,847.20", icon: TrendingUp },
      { label: "Categories", value: "12", icon: PieChart },
      { label: "Transactions", value: "156", icon: Calendar },
    ],
  },
}

export default function NLPAssistantPage() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<
    Array<{
      type: "user" | "assistant"
      content: string
      timestamp: string
      insights?: Array<{ label: string; value: string; icon: any }>
    }>
  >([])
  const { toast } = useToast()

  // Determine user role (in real app, this would come from auth context)
  const userRole = "USER" // Change to 'ADMIN' to see admin features

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const timestamp = new Date().toLocaleTimeString()

    // Add user message
    setConversation((prev) => [
      ...prev,
      {
        type: "user",
        content: query,
        timestamp,
      },
    ])

    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      let response = mockResponses.default

      if (query.toLowerCase().includes("grocery")) {
        response = mockResponses.grocery
      } else if (query.toLowerCase().includes("entertainment")) {
        response = mockResponses.entertainment
      }

      setConversation((prev) => [
        ...prev,
        {
          type: "assistant",
          content: response.response,
          timestamp: new Date().toLocaleTimeString(),
          insights: response.insights,
        },
      ])

      setIsLoading(false)
      setQuery("")
    }, 1500)
  }

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery)
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole={userRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole={userRole} userName={userRole === "ADMIN" ? "Admin User" : "John Doe"} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">AI Assistant</h1>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Ask natural language questions about your financial data
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Chat Interface */}
            <div className="lg:col-span-2 flex flex-col">
              <Card className="neumorphic border-0 flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Conversation</span>
                  </CardTitle>
                  <CardDescription>
                    Ask questions about your spending, transactions, and financial patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {conversation.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Welcome to your AI Financial Assistant!</h3>
                        <p className="text-muted-foreground mb-4">
                          I can help you understand your spending patterns, analyze transactions, and provide financial
                          insights.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try asking a question or click on one of the sample queries below.
                        </p>
                      </div>
                    ) : (
                      conversation.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.type === "user" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-2 ${
                                message.type === "user" ? "text-blue-100" : "text-muted-foreground"
                              }`}
                            >
                              {message.timestamp}
                            </p>

                            {/* Insights for assistant messages */}
                            {message.type === "assistant" && message.insights && (
                              <div className="grid grid-cols-2 gap-2 mt-4">
                                {message.insights.map((insight, idx) => {
                                  const Icon = insight.icon
                                  return (
                                    <div key={idx} className="bg-white dark:bg-slate-700 rounded-lg p-3">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <Icon className="h-4 w-4 text-blue-600" />
                                        <span className="text-xs text-muted-foreground">{insight.label}</span>
                                      </div>
                                      <p className="font-semibold text-sm">{insight.value}</p>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 max-w-[80%]">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-muted-foreground">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask about your spending, transactions, or financial patterns..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !query.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sample Queries & Tips */}
            <div className="space-y-6">
              {/* Sample Queries */}
              <Card className="neumorphic border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Sample Queries</CardTitle>
                  <CardDescription>Click to try these example questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sampleQueries.map((sampleQuery, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-3 hover:bg-blue-50 dark:hover:bg-blue-950"
                        onClick={() => handleSampleQuery(sampleQuery)}
                      >
                        <span className="text-sm">{sampleQuery}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="neumorphic border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Be specific about time periods (e.g., "last month", "this week")</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Ask about specific categories like "food", "entertainment", "transportation"</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Request comparisons between different time periods</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Ask for insights about spending patterns and trends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
