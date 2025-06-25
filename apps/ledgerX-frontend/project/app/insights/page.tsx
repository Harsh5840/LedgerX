"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, Send, TrendingUp, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Why did my shopping expenses increase last month?",
  "What's my average monthly food spending?",
  "Are there any unusual spending patterns?",
  "How much did I save compared to last quarter?",
  "What categories should I focus on reducing?",
];

const mockInsights = [
  {
    title: "Shopping Spike Detected",
    description: "Your shopping expenses increased by 34% in December, primarily due to holiday purchases.",
    type: "trend",
    icon: TrendingUp,
    color: "text-blue-500",
  },
  {
    title: "Budget Alert",
    description: "You're approaching your monthly food budget limit. Consider home cooking more often.",
    type: "alert",
    icon: AlertCircle,
    color: "text-yellow-500",
  },
  {
    title: "Savings Opportunity",
    description: "You could save $240/month by switching to annual subscriptions for your services.",
    type: "savings",
    icon: DollarSign,
    color: "text-green-500",
  },
];

export default function Insights() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm your AI financial assistant. Ask me anything about your spending patterns, budgets, or financial trends. I can help you understand your finances better!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mockAIResponses = [
    "Based on your transaction history, your shopping expenses increased by 34% last month, primarily due to holiday purchases at Amazon ($450) and Target ($230). This spike was expected given the seasonal pattern.",
    "Your average monthly food spending is $320, which is 12% above the recommended budget for your income level. Consider meal planning to reduce this by 15-20%.",
    "I've detected an unusual pattern: you've been making more late-night purchases recently, which are typically impulse buys. These account for $180 in unexpected spending.",
    "Compared to last quarter, you've saved $840 more this quarter! Your consistent reduction in entertainment expenses has been the biggest contributor.",
    "Focus on reducing your subscription services (currently $89/month) and dining out expenses ($280/month). These two categories offer the best optimization opportunities.",
  ];

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("shopping") || input.includes("increase")) {
      return mockAIResponses[0];
    } else if (input.includes("food") || input.includes("average")) {
      return mockAIResponses[1];
    } else if (input.includes("unusual") || input.includes("pattern")) {
      return mockAIResponses[2];
    } else if (input.includes("save") || input.includes("quarter")) {
      return mockAIResponses[3];
    } else if (input.includes("reduce") || input.includes("focus")) {
      return mockAIResponses[4];
    } else {
      return "I've analyzed your financial data and found some interesting patterns. Your spending shows good consistency overall, with room for optimization in recurring subscriptions and discretionary purchases. Would you like me to elaborate on any specific category?";
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse = generateAIResponse(messageContent);
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">
            Get intelligent insights about your financial patterns and spending habits
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Insights Cards */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Insights</CardTitle>
                <CardDescription>
                  AI-generated observations about your finances
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                  >
                    <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Questions</CardTitle>
                <CardDescription>
                  Click to ask these common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-2 whitespace-normal"
                    onClick={() => handleSendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-primary" />
                  AI Financial Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about your spending patterns, budgets, and financial trends
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === "user" 
                          ? "bg-primary text-primary-foreground ml-12" 
                          : "bg-muted mr-12"
                      }`}>
                        {message.type === "ai" && (
                          <div className="flex items-center mb-2">
                            <Brain className="h-4 w-4 mr-2 text-primary" />
                            <Badge variant="secondary" className="text-xs">AI Assistant</Badge>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted p-3 rounded-lg mr-12">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">Analyzing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Ask me about your finances..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}