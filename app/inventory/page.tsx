"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScanLine, Plus, Trash2, ChefHat, AlertTriangle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// Sample inventory data as fallback
const sampleInventory = [
  {
    id: 1,
    name: "Milk",
    expiryDate: "2025-04-15",
    daysLeft: 12,
    category: "Dairy",
  },
  {
    id: 2,
    name: "Bread",
    expiryDate: "2025-04-05",
    daysLeft: 2,
    category: "Bakery",
  },
  {
    id: 3,
    name: "Chicken",
    expiryDate: "2025-04-07",
    daysLeft: 4,
    category: "Meat",
  },
  {
    id: 4,
    name: "Spinach",
    expiryDate: "2025-04-06",
    daysLeft: 3,
    category: "Vegetables",
  },
  {
    id: 5,
    name: "Yogurt",
    expiryDate: "2025-04-10",
    daysLeft: 7,
    category: "Dairy",
  },
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState(sampleInventory)
  const { toast } = useToast()
  const containerRef = useRef<HTMLDivElement>(null)

  // Load inventory from localStorage on mount
  useEffect(() => {
    try {
      const storedInventory = localStorage.getItem("inventory")
      if (storedInventory) {
        const parsedInventory = JSON.parse(storedInventory)
        if (Array.isArray(parsedInventory) && parsedInventory.length > 0) {
          setInventory(parsedInventory)
        }
      }
    } catch (error) {
      console.error("Error loading inventory from localStorage:", error)
    }
  }, [])

  // Function to remove an item from inventory
  const removeItem = (id: number) => {
    const updatedInventory = inventory.filter((item) => item.id !== id)
    setInventory(updatedInventory)

    // Update localStorage
    try {
      localStorage.setItem("inventory", JSON.stringify(updatedInventory))
    } catch (error) {
      console.error("Error updating localStorage:", error)
    }

    toast({
      title: "Item removed",
      description: "Item has been removed from your inventory",
    })
  }

  // Function to get badge variant based on days left
  const getBadgeVariant = (daysLeft: number) => {
    if (daysLeft <= 2) return "destructive"
    if (daysLeft <= 5) return "warning"
    return "outline"
  }

  // Find recipes for a specific item
  const findRecipesForItem = (itemName: string) => {
    // Store the ingredient in localStorage for the recipe generation page
    localStorage.setItem("recipeIngredients", JSON.stringify([itemName]))
    // Navigate to recipe generation page
    window.location.href = "/recipes/generate"
  }

  // Show notification for items expiring in less than 3 days
  useEffect(() => {
    const expiringItems = inventory.filter((item) => item.daysLeft <= 3)

    if (expiringItems.length > 0) {
      // In a real app, this would trigger a push notification
      // For demo purposes, we'll just show a toast
      toast({
        title: "Items Expiring Soon!",
        description: `You have ${expiringItems.length} items expiring in the next 3 days`,
        variant: "destructive",
      })
    }
  }, [])

  // 3D card effect
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
        const rotateX = (y - centerY) / 30
        const rotateY = (centerX - x) / 30
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
    <div className="container mx-auto p-4 max-w-4xl relative" ref={containerRef}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-coder-grid bg-grid-pattern opacity-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6 relative z-10"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-coder-primary to-coder-accent bg-clip-text text-transparent">
          Your Food Inventory
        </h1>
        <div className="flex gap-2">
          <Link href="/scan">
            <Button
              variant="outline"
              size="sm"
              className="border-coder-primary/50 text-coder-primary hover:bg-coder-primary/10"
            >
              <ScanLine className="mr-2 h-4 w-4" /> Scan New
            </Button>
          </Link>
          <Link href="/add-manual">
            <Button
              variant="outline"
              size="sm"
              className="border-coder-accent/50 text-coder-accent hover:bg-coder-accent/10"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Manually
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Expiring soon section with alert styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8 border-destructive/50 card-3d bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent"></div>
          <CardHeader className="bg-destructive/5 relative">
            <CardTitle className="text-lg flex items-center text-destructive">
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
              </motion.div>
              Expiring Soon - Urgent Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {inventory
                  .filter((item) => item.daysLeft <= 3)
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className={`bg-muted/50 ${item.daysLeft <= 2 ? "border-destructive/50" : "border-warning/50"} overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent"></div>
                        <CardContent className="p-4 flex justify-between items-center relative">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Expires: {new Date(item.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={getBadgeVariant(item.daysLeft)}
                              className={`${item.daysLeft <= 2 ? "bg-destructive text-white" : "bg-warning text-black"} animate-pulse`}
                            >
                              {item.daysLeft} days left
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Find recipes"
                              className="hover:bg-coder-primary/10 hover:text-coder-primary"
                              onClick={() => findRecipesForItem(item.name)}
                            >
                              <ChefHat className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {inventory.filter((item) => item.daysLeft <= 3).length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-4">No items expiring soon</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Full inventory table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-coder-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-coder-primary">All Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-coder-primary/20">
                  <TableHead className="text-coder-primary">Item</TableHead>
                  <TableHead className="text-coder-primary">Category</TableHead>
                  <TableHead className="text-coder-primary">Expiry Date</TableHead>
                  <TableHead className="text-coder-primary">Days Left</TableHead>
                  <TableHead className="text-right text-coder-primary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {inventory.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                      className={`${item.daysLeft <= 3 ? "bg-destructive/5" : ""} border-b border-border/40 hover:bg-coder-primary/5`}
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getBadgeVariant(item.daysLeft)}
                          className={item.daysLeft <= 3 ? "animate-pulse" : ""}
                        >
                          {item.daysLeft} days
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Find recipes"
                            className="hover:bg-coder-primary/10 hover:text-coder-primary"
                            onClick={() => findRecipesForItem(item.name)}
                          >
                            <ChefHat className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            title="Remove item"
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

