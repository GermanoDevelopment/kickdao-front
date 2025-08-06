"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth.context"
import { Breadcrumb } from "@/components/navigation/breadcrumb"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check for demo user in non-production environments
    const checkDemoUser = () => {
      if (process.env.NODE_ENV !== "production") {
        const demoUser = localStorage.getItem("demoUser")
        return !!demoUser
      }
      return false
    }

    if (!loading && !user && !checkDemoUser()) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
      </div>
    )
  }

  const isDemoUser = process.env.NODE_ENV !== "production" && localStorage.getItem("demoUser")
  if (!loading && (user || isDemoUser)) {
    return (
      <>
        <Breadcrumb />
        {children}
      </>
    )
  }

  return null
}
