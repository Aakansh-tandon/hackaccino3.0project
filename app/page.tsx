"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanLine, Calendar, ChefHat, ArrowRight, Shield } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)

  // 3D tilt effect
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const cards = container.querySelectorAll(".card-3d")
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = (y - centerY) / 20
        const rotateY = (centerX - x) / 20
        ;(card as HTMLElement).style.transform =
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      })
    }

    const handleMouseLeave = () => {
      const cards = container.querySelectorAll(".card-3d")
      cards.forEach((card) => {
        ;(card as HTMLElement).style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
      })
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-coder-grid bg-grid-pattern opacity-20"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-coder-primary opacity-10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl w-full z-10" ref={containerRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-coder-primary via-coder-accent to-coder-secondary bg-clip-text text-transparent animate-text-shimmer">
            Food Expiry Tracker
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Scan, track, and get recipe suggestions for your food items before they expire
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="card-3d border border-coder-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-coder-primary/10 to-transparent"></div>
            <CardHeader>
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                <ScanLine className="h-8 w-8 mb-2 text-coder-primary" />
              </motion.div>
              <CardTitle className="text-coder-primary">Scan Products</CardTitle>
              <CardDescription>Scan barcodes or expiry dates with your camera</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                className="w-full bg-coder-primary hover:bg-coder-primary/80 text-black"
                onClick={() => (window.location.href = "/scan")}
              >
                Scan Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="card-3d border border-coder-accent/20 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-coder-accent/10 to-transparent"></div>
            <CardHeader>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
              >
                <Calendar className="h-8 w-8 mb-2 text-coder-accent" />
              </motion.div>
              <CardTitle className="text-coder-accent">Track Expiry</CardTitle>
              <CardDescription>Get reminders before your food expires</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-coder-accent/50 text-coder-accent hover:bg-coder-accent/10"
                onClick={() => (window.location.href = "/inventory")}
              >
                View Inventory <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="card-3d border border-coder-secondary/20 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-coder-secondary/10 to-transparent"></div>
            <CardHeader>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
              >
                <ChefHat className="h-8 w-8 mb-2 text-coder-secondary" />
              </motion.div>
              <CardTitle className="text-coder-secondary">Recipe Suggestions</CardTitle>
              <CardDescription>Get AI-powered recipe ideas based on your ingredients</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-coder-secondary/50 text-coder-secondary hover:bg-coder-secondary/10"
                onClick={() => (window.location.href = "/recipes")}
              >
                View Recipes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-center gap-4"
        >
          <Button
            size="lg"
            className="gap-2 cyber-button bg-gradient-to-r from-coder-primary to-coder-accent text-black font-bold"
            onClick={() => (window.location.href = "/login")}
          >
            <Shield className="h-5 w-5" /> Sign In
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-coder-primary hover:bg-coder-primary/10 hover:text-coder-primary"
            onClick={() => (window.location.href = "/signup")}
          >
            Create Account
          </Button>
        </motion.div>
      </div>
    </main>
  )
}

