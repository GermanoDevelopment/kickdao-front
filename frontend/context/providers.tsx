"use client"

import type React from "react"
import { AuthProvider } from "./auth.context"
import { ProjectProvider } from "./project.context"
import { InvestmentProvider } from "./investment.context"
import { ContractProvider } from "./contract.context"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()
import { config } from './config'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
      <ContractProvider>
        <ProjectProvider>
          <InvestmentProvider>{children}</InvestmentProvider>
        </ProjectProvider>
      </ContractProvider>
      </QueryClientProvider>
      </WagmiProvider>
    </AuthProvider>
  )
}
