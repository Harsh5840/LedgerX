"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, Shield, Users, Zap, Star, BarChart3, Lock, Globe, Smartphone } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating background elements
      gsap.to(".floating-circle", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: "random(3, 6)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      })

      // Hero animation
      const tl = gsap.timeline()
      tl.from(".hero-content > *", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      })
      tl.from(
        ".hero-image",
        {
          x: 100,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5",
      )

      // Stats counter animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.from(".stat-number", {
            textContent: 0,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            stagger: 0.2,
          })
        },
      })

      // Feature cards animation
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.from(".feature-card", {
            y: 50,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-circle absolute top-20 left-10 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl opacity-60" />
        <div className="floating-circle absolute top-40 right-20 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-xl opacity-40" />
        <div className="floating-circle absolute bottom-40 left-1/4 w-40 h-40 bg-green-100 dark:bg-green-900/20 rounded-full blur-xl opacity-30" />
        <div className="floating-circle absolute bottom-20 right-1/3 w-28 h-28 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-xl opacity-50" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-slate-900 font-bold text-sm">LX</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">LedgerX</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#security"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Security
              </Link>
              <Link
                href="#pricing"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 dark:text-slate-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content space-y-8">
              <div className="space-y-4">
                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                  <Zap className="w-3 h-3 mr-1" />
                  Next-Gen FinTech Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Financial Intelligence
                  <span className="block text-slate-600 dark:text-slate-400">Redefined</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg">
                  Experience the future of financial management with AI-powered insights, real-time analytics, and
                  enterprise-grade security.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 group"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">$2.4B+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">50K+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Users</div>
                </div>
              </div>
            </div>

            <div className="hero-image relative">
              <div className="relative">
                <img
                  src="/images/hero-dashboard.png"
                  alt="LedgerX Dashboard"
                  className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/10 to-transparent rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative z-10 py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="stat-number text-4xl font-bold text-slate-900 dark:text-white mb-2">2400000</div>
              <div className="text-slate-600 dark:text-slate-400">Transactions Processed</div>
            </div>
            <div className="text-center">
              <div className="stat-number text-4xl font-bold text-slate-900 dark:text-white mb-2">50000</div>
              <div className="text-slate-600 dark:text-slate-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="stat-number text-4xl font-bold text-slate-900 dark:text-white mb-2">99</div>
              <div className="text-slate-600 dark:text-slate-400">% Uptime</div>
            </div>
            <div className="text-center">
              <div className="stat-number text-4xl font-bold text-slate-900 dark:text-white mb-2">24</div>
              <div className="text-slate-600 dark:text-slate-400">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="relative z-10 py-32 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to manage finances
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              From real-time analytics to AI-powered insights, LedgerX provides all the tools modern businesses need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="feature-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <BarChart3 className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Real-time Analytics</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Get instant insights into your financial data with live dashboards and customizable reports.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="feature-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <Shield className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Enterprise Security</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Bank-grade encryption and multi-layer security protocols protect your sensitive data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="feature-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <Zap className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">AI-Powered Insights</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Machine learning algorithms analyze patterns and provide predictive financial insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="feature-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <Globe className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Global Compliance</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Built-in compliance tools for regulations across 24+ countries and jurisdictions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="feature-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <Smartphone className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Mobile First</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Native mobile apps with full feature parity for managing finances on the go.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="feature-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <Users className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Team Collaboration</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Role-based access controls and collaborative tools for financial teams.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by finance teams worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                  "LedgerX transformed how we handle financial operations. The AI insights alone saved us 40% in
                  processing time."
                </p>
                <div className="flex items-center">
                  <img src="/images/team-photo.jpg" alt="Sarah Chen" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Sarah Chen</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">CFO, TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                  "The security features and compliance tools make LedgerX perfect for our regulated industry."
                </p>
                <div className="flex items-center">
                  <img src="/images/team-photo.jpg" alt="Michael Rodriguez" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Michael Rodriguez</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Finance Director, HealthPlus</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                  "Real-time analytics and mobile access keep our team connected and informed wherever we are."
                </p>
                <div className="flex items-center">
                  <img src="/images/team-photo.jpg" alt="Emily Watson" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Emily Watson</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">VP Finance, StartupXYZ</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to transform your financial operations?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using LedgerX to streamline their financial processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-slate-900 font-bold text-sm">LX</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">LedgerX</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Next-generation financial intelligence platform for modern businesses.
              </p>
              <div className="flex items-center space-x-4">
                <img src="/images/security-badge.png" alt="SOC 2 Certified" className="h-8" />
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Lock className="w-3 h-3 mr-1" />
                  Bank Grade Security
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 dark:text-slate-400">© 2024 LedgerX. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
