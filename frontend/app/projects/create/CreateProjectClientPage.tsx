"use client"

import { useState } from "react"

import { CreateProjectForm } from "@/components/projects/create-project-form"
import { KdaoTokenCheck } from "@/components/wallet/kdao-token-check"
import { useContract } from "@/context/contract.context"
import { useAuth } from "@/context/auth.context"

export default function CreateProjectClientPage() {
  const { user } = useAuth()
  const { hasKdaoToken, connected } = useContract()
  const [tokenVerified, setTokenVerified] = useState(hasKdaoToken)

  if (!user) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold text-dark-purple mb-6">Criar Novo Projeto</h1>
        <p className="text-medium-gray mb-6">Você precisa estar logado para criar um projeto.</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-purple">Criar Novo Projeto</h1>
          <p className="text-medium-gray">Preencha as informações abaixo para criar seu projeto de crowdfunding</p>
        </div>

        {!tokenVerified ? <KdaoTokenCheck onSuccess={() => setTokenVerified(true)} /> : <CreateProjectForm />}
      </div>
    </div>
  )
}
