"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScanLine, Camera, X, Check } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState("barcode")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Start camera for scanning
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setScanning(true)

        // In a real app, we would implement actual barcode/OCR scanning here
        // For demo purposes, we'll simulate a scan after 3 seconds
        setTimeout(() => {
          if (activeTab === "barcode") {
            setResult("8901058851826") // Simulated barcode result
          } else {
            setResult("Best Before: 15/04/2025") // Simulated OCR result
          }
          setScanning(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      })
      setScanning(false)
    }
  }

  // Stop camera
  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setScanning(false)
    }
  }

  // Handle scan result
  const handleScanResult = () => {
    // In a real app, we would process the scan result here
    // For demo purposes, we'll just show a success message and redirect
    toast({
      title: "Scan Successful",
      description:
        activeTab === "barcode" ? "Product added to your inventory" : "Expiry date detected and added to calendar",
      variant: "default",
    })

    // Redirect to product details or add product form
    router.push("/inventory")
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Scan Product</h1>

      <Tabs defaultValue="barcode" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="barcode">Barcode</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Date</TabsTrigger>
        </TabsList>

        <Card className="mb-6">
          <CardContent className="p-0 relative">
            {!result ? (
              <>
                <div className="aspect-video bg-muted relative overflow-hidden rounded-md">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
                  {scanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-primary rounded-lg flex items-center justify-center">
                        <ScanLine className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center rounded-md">
                <div className="text-center p-6">
                  <Check className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Scan Complete</h3>
                  <p className="text-muted-foreground mb-4">{result}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          {!scanning && !result ? (
            <Button onClick={startScanning} className="flex-1">
              <Camera className="mr-2 h-4 w-4" /> Start Scanning
            </Button>
          ) : !result ? (
            <Button variant="outline" onClick={stopScanning} className="flex-1">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null)
                  setScanning(false)
                }}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" /> Rescan
              </Button>
              <Button onClick={handleScanResult} className="flex-1">
                <Check className="mr-2 h-4 w-4" /> Confirm
              </Button>
            </>
          )}
        </div>
      </Tabs>
    </div>
  )
}

