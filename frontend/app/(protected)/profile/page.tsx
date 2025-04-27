"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { ProfileForm } from "@/components/profile/profile-form"
import { WalletForm } from "@/components/profile/wallet-form"
import { KdaoTokenInfo } from "@/components/profile/kdao-token-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "wallet") {
      setActiveTab("wallet")
    } else if (tab === "token") {
      setActiveTab("token")
    }
  }, [searchParams])

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-purple">Seu Perfil</h1>
          <p className="text-medium-gray">Gerencie suas informações pessoais e configurações de conta</p>
        </div>

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="wallet">Carteira Digital</TabsTrigger>
            <TabsTrigger value="token">Token KDAO</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-6">
            <ProfileForm />
          </TabsContent>
          <TabsContent value="wallet" className="mt-6">
            <WalletForm />
          </TabsContent>
          <TabsContent value="token" className="mt-6">
            <KdaoTokenInfo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
