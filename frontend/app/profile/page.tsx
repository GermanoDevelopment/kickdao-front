import type { Metadata } from "next"

import { ProfileForm } from "@/components/profile/profile-form"
import { WalletForm } from "@/components/profile/wallet-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Perfil | Kick DAO",
  description: "Gerencie seu perfil na Kick DAO",
}

export default function ProfilePage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-purple">Seu Perfil</h1>
          <p className="text-medium-gray">Gerencie suas informações pessoais e configurações de conta</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="wallet">Carteira Digital</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-6">
            <ProfileForm />
          </TabsContent>
          <TabsContent value="wallet" className="mt-6">
            <WalletForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
