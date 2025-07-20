"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Brain,
  Sparkles,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const sampleQueries = [
  "What's my grocery spend in June?",
  "Show me my largest expenses this week",
  "How much did I spend on entertainment?",
  "Flagged payments over $10,000 this year?",
  "Compare my spending to last month",
  "What's my average transaction amount?",
]

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
  const userRole: "USER" | "ADMIN" = "USER"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const timestamp = new Date().toLocaleTimeString()
    setConversation((prev) => [
      ...prev,
      { type: "user", content: query, timestamp },
    ])
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/nlp/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: query }),
      })

      const data = await res.json()

      if (!data.success) {
        setConversation((prev) => [
          ...prev,
          {
            type: "assistant",
            content: "Sorry, I couldn't understand that. Please try rephrasing.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
      } else {
        const insights =
          data.type === "TOTAL_SPENT"
            ? [
                { label: "Total Spent", value: `$${data.total}`, icon: DollarSign },
              ]
            : data.type === "TOP_CATEGORIES"
            ? data.categories.map((cat: any) => ({
                label: cat.name,
                value: `$${cat.total.toFixed(2)}`,
                icon: PieChart,
              }))
            : undefined

        setConversation((prev) => [
          ...prev,
          {
            type: "assistant",
            content:
              data.type === "TOTAL_SPENT"
                ? `You spent $${data.total} in the selected period.`
                : data.type === "TOP_CATEGORIES"
                ? `Here are your top spending categories:`
                : "I'm not sure how to respond.",
            timestamp: new Date().toLocaleTimeString(),
            insights,
          },
        ])
      }
    } catch (err) {
      console.error(err)
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch response from AI backend." })
    }

    setIsLoading(false)
    setQuery("")
  }
  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery)
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userRole={userRole} />

      <div className="flex-1 flex flex-col">
        <Navbar userRole={userRole} userName="John Doe" />

        <main className="flex-1 flex flex-col p-4 min-h-0">
          {/* Header */}
          <div className="mb-4 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI Assistant</h1>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Ask natural language questions about your financial data
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
            {/* Chat Interface */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <Card className="neumorphic border-0 flex-1 flex flex-col min-h-0">
                <CardHeader className="flex-shrink-0 pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <MessageCircle className="h-4 w-4" />
                    <span>Conversation</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Ask questions about your spending, transactions, and financial patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0 p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 px-4 pt-2 pb-2">
                    {conversation.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-base font-semibold mb-2">Welcome to your AI Financial Assistant!</h3>
                        <p className="text-muted-foreground mb-3 text-sm">
                          I can help you understand your spending patterns, analyze transactions, and provide financial
                          insights.
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                  <div className="flex-shrink-0 px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sample Queries & Tips */}
            <div className="space-y-4 flex flex-col min-h-0">
              {/* Sample Queries */}
              <Card className="neumorphic border-0 flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Sample Queries</CardTitle>
                  <CardDescription className="text-sm">Click to try these example questions</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    {sampleQueries.map((sampleQuery, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-2 hover:bg-blue-50 dark:hover:bg-blue-950"
                        onClick={() => handleSampleQuery(sampleQuery)}
                      >
                        <span className="text-xs">{sampleQuery}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="neumorphic border-0 flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tips</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Be specific about time periods (e.g., "last month", "this week")</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Ask about specific categories like "food", "entertainment", "transportation"</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Request comparisons between different time periods</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1.5 flex-shrink-0"></div>
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