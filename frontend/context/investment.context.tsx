"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "./firebase-config"
import { useAuth } from "./auth.context"

// Definição dos tipos
export interface Investment {
  id: string
  userId: string
  projectId: string
  projectName: string
  amount: number
  shares: number
  timestamp: Date
}

interface InvestmentContextType {
  getUserInvestments: () => Promise<Investment[]>
  getProjectInvestors: (projectId: string) => Promise<Investment[]>
  getTotalInvested: () => Promise<number>
  getInvestmentsByProject: () => Promise<
    { projectId: string; projectName: string; totalAmount: number; totalShares: number }[]
  >
  loading: boolean
}

// Criação do contexto
const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined)

// Hook personalizado para usar o contexto
export const useInvestment = () => {
  const context = useContext(InvestmentContext)
  if (context === undefined) {
    throw new Error("useInvestment deve ser usado dentro de um InvestmentProvider")
  }
  return context
}

// Provider do contexto
export const InvestmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Função para obter os investimentos do usuário
  const getUserInvestments = async () => {
    if (!user) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      const investmentsQuery = query(
        collection(db, "investments"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
      )

      const querySnapshot = await getDocs(investmentsQuery)

      const investments: Investment[] = []

      querySnapshot.forEach((doc) => {
        const investmentData = doc.data()

        // Converte o timestamp do Firestore para Date
        const investment: Investment = {
          ...investmentData,
          id: doc.id,
          timestamp: investmentData.timestamp?.toDate() || new Date(),
        } as Investment

        investments.push(investment)
      })

      return investments
    } catch (error) {
      console.error("Erro ao obter investimentos do usuário:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para obter os investidores de um projeto
  const getProjectInvestors = async (projectId: string) => {
    try {
      setLoading(true)

      const investmentsQuery = query(
        collection(db, "investments"),
        where("projectId", "==", projectId),
        orderBy("timestamp", "desc"),
      )

      const querySnapshot = await getDocs(investmentsQuery)

      const investments: Investment[] = []

      querySnapshot.forEach((doc) => {
        const investmentData = doc.data()

        // Converte o timestamp do Firestore para Date
        const investment: Investment = {
          ...investmentData,
          id: doc.id,
          timestamp: investmentData.timestamp?.toDate() || new Date(),
        } as Investment

        investments.push(investment)
      })

      return investments
    } catch (error) {
      console.error("Erro ao obter investidores do projeto:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para obter o total investido pelo usuário
  const getTotalInvested = async () => {
    if (!user) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      const investments = await getUserInvestments()

      const total = investments.reduce((acc, investment) => acc + investment.amount, 0)

      return total
    } catch (error) {
      console.error("Erro ao obter total investido:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para obter os investimentos agrupados por projeto
  const getInvestmentsByProject = async () => {
    if (!user) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      const investments = await getUserInvestments()

      const projectMap = new Map<
        string,
        { projectId: string; projectName: string; totalAmount: number; totalShares: number }
      >()

      investments.forEach((investment) => {
        const { projectId, projectName, amount, shares } = investment

        if (projectMap.has(projectId)) {
          const project = projectMap.get(projectId)!
          project.totalAmount += amount
          project.totalShares += shares
        } else {
          projectMap.set(projectId, {
            projectId,
            projectName,
            totalAmount: amount,
            totalShares: shares,
          })
        }
      })

      return Array.from(projectMap.values())
    } catch (error) {
      console.error("Erro ao obter investimentos por projeto:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    getUserInvestments,
    getProjectInvestors,
    getTotalInvested,
    getInvestmentsByProject,
    loading,
  }

  return <InvestmentContext.Provider value={value}>{children}</InvestmentContext.Provider>
}
