"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"

export function DemoBanner() {
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if we're using a demo user
    if (process.env.NODE_ENV !== "production") {
      const demoUser = localStorage.getItem("demoUser")
      setIsDemoMode(!!demoUser)
    }
  }, [])

  if (!isDemoMode) return null

  return (
    <Alert variant="warning" className="fixed bottom-4 right-4 max-w-md z-50 bg-yellow-50 border-yellow-300">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Modo de Demonstração</AlertTitle>
      <AlertDescription className="text-yellow-700">
        Você está usando uma conta de demonstração. Algumas funcionalidades podem estar limitadas.
      </AlertDescription>
    </Alert>
  )
}
