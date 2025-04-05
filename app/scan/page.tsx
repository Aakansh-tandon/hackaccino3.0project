"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanLine, Camera, X, Check, Edit, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ScanPage() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState(true)
  const [productName, setProductName] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const startScanning = async () => {
    setShowOptions(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setScanning(true)

        const track = stream.getVideoTracks()[0]
        const imageCapture = new ImageCapture(track)

        const captureFrame = async () => {
          const bitmap = await imageCapture.grabFrame()
          const canvas = canvasRef.current
          const ctx = canvas?.getContext("2d")

          if (!canvas || !ctx) return

          canvas.width = bitmap.width
          canvas.height = bitmap.height
          ctx.drawImage(bitmap, 0, 0)

          const imageData = canvas.toDataURL()

          const { createWorker } = await import("tesseract.js")
          const worker = await createWorker({
            logger: (m) => console.log(m),
          })

          await worker.loadLanguage("eng")
          await worker.initialize("eng")
          const {
            data: { text },
          } = await worker.recognize(imageData)

          const cleanedText = text.replace(/\s+/g, " ").trim()

          const dateMatch = cleanedText.match(
            /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/
          )

          if (dateMatch && dateMatch[0]) {
            setResult(`Expiry: ${dateMatch[0]}`)
          } else {
            setResult("Couldn't detect expiry date.")
          }

          await worker.terminate()
          setScanning(false)
        }

        // Thoda delay de rha hu capture ko camera focus hone ka time mile
        setTimeout(captureFrame, 3500)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      })
      setScanning(false)
      setShowOptions(true)
    }
  }

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setScanning(false)
      setShowOptions(true)
    }
  }

  const handleScanResult = () => {
    if (!productName) {
      toast({
        title: "Missing Product Name",
        description: "Please enter the product name before saving.",
        variant: "destructive",
      })
      return
    }

    const newItem = {
      name: productName,
      expiry: result?.replace("Expiry: ", "") || "N/A",
    }

    const existing = JSON.parse(localStorage.getItem("inventory") || "[]")
    const updated = [...existing, newItem]
    localStorage.setItem("inventory", JSON.stringify(updated))

    toast({
      title: "Product Added!",
      description: `${productName} expiring on ${newItem.expiry} added to inventory.`,
      variant: "default",
    })

    router.push("/inventory")
  }

  const goToManualEntry = () => {
    router.push("/add-manual")
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>

      {showOptions && !result ? (
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Card
            className="border-coder-primary/20 hover:border-coder-primary/50 transition-colors cursor-pointer"
            onClick={startScanning}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Camera className="mr-2 h-5 w-5 text-coder-primary" />
                Scan Expiry Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use your camera to scan expiry date
              </p>
              <Button className="w-full mt-4">
                Start Camera <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border-coder-accent/20 hover:border-coder-accent/50 transition-colors cursor-pointer"
            onClick={goToManualEntry}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Edit className="mr-2 h-5 w-5 text-coder-accent" />
                Enter Manually
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manually enter product details and expiry date</p>
              <Button
                variant="outline"
                className="w-full mt-4 border-coder-accent/50 text-coder-accent hover:bg-coder-accent/10"
              >
                Enter Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
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
                <div className="text-center p-6 w-full">
                  <Check className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Scan Complete</h3>
                  <p className="text-muted-foreground mb-2">{result}</p>
                  <input
                    type="text"
                    placeholder="Enter Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        {!showOptions && !scanning && !result ? (
          <Button variant="outline" onClick={() => setShowOptions(true)} className="flex-1">
            <X className="mr-2 h-4 w-4" /> Back to Options
          </Button>
        ) : !result && scanning ? (
          <Button variant="outline" onClick={stopScanning} className="flex-1">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        ) : result ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setResult(null)
                setScanning(false)
                setProductName("")
                setShowOptions(true)
              }}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" /> Rescan
            </Button>
            <Button onClick={handleScanResult} className="flex-1">
              <Check className="mr-2 h-4 w-4" /> Confirm
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}
