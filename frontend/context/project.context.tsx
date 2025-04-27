"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "./firebase-config"
import { useAuth } from "./auth.context"

// Definição dos tipos
export interface Milestone {
  title: string
  description: string
  amount: number
  completed: boolean
}

export interface Supporter {
  uid: string
  name: string
  address: string
  amount: number
  shares: number
  timestamp: Date
}

export interface ProjectUpdate {
  id: string
  title: string
  content: string
  date: Date
}

// Adicione o campo onChainProjectId à interface Project
export interface Project {
  id: string
  name: string
  category: string
  description: string
  coverImage: string
  additionalImages: string[]
  creator: {
    uid: string
    name: string
    address: string
    ens?: string
    avatar?: string
  }
  funding: {
    current: number
    target: number
    percentageFunded: number
    pricePerShare: number
    sharesRemaining: number
    deadline: Date
  }
  milestones: Milestone[]
  supporters: Supporter[]
  updates: ProjectUpdate[]
  refundPolicy: string
  status: "draft" | "pending" | "active" | "funded" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
  onChainProjectId?: string // Novo campo para armazenar o ID do projeto no blockchain
}

interface ProjectContextType {
  createProject: (
    projectData: Omit<Project, "id" | "creator" | "supporters" | "updates" | "createdAt" | "updatedAt" | "status">,
  ) => Promise<string>
  updateProject: (projectId: string, projectData: Partial<Project>) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  getProject: (projectId: string) => Promise<Project | null>
  getUserProjects: () => Promise<Project[]>
  getRecentProjects: (limit?: number) => Promise<Project[]>
  getPopularProjects: (limit?: number) => Promise<Project[]>
  getEndingSoonProjects: (limit?: number) => Promise<Project[]>
  addProjectUpdate: (projectId: string, update: Omit<ProjectUpdate, "id" | "date">) => Promise<void>
  uploadProjectImage: (file: File) => Promise<string>
  supportProject: (projectId: string, amount: number, shares: number) => Promise<void>
  loading: boolean
}

// Criação do contexto
const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

// Hook personalizado para usar o contexto
export const useProject = () => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject deve ser usado dentro de um ProjectProvider")
  }
  return context
}

// Provider do contexto
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const { user, userProfile } = useAuth()

  // Função para criar um novo projeto
  const createProject = async (
    projectData: Omit<Project, "id" | "creator" | "supporters" | "updates" | "createdAt" | "updatedAt" | "status">,
  ) => {
    if (!user || !userProfile) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      // Prepara os dados do projeto
      const newProject = {
        ...projectData,
        creator: {
          uid: user.uid,
          name: userProfile.displayName || "Usuário Anônimo",
          address: userProfile.walletAddress || "",
          ens: "",
          avatar: userProfile.photoURL || "",
        },
        supporters: [],
        updates: [],
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Adiciona o projeto ao Firestore
      const docRef = await addDoc(collection(db, "projects"), newProject)

      return docRef.id
    } catch (error) {
      console.error("Erro ao criar projeto:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para atualizar um projeto existente
  const updateProject = async (projectId: string, projectData: Partial<Project>) => {
    if (!user) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      // Verifica se o usuário é o criador do projeto
      const projectRef = doc(db, "projects", projectId)
      const projectSnap = await getDoc(projectRef)

      if (!projectSnap.exists()) {
        throw new Error("Projeto não encontrado")
      }

      const projectDoc = projectSnap.data() as Project

      if (projectDoc.creator.uid !== user.uid) {
        throw new Error("Você não tem permissão para editar este projeto")
      }

      // Atualiza o projeto
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para excluir um projeto
  const deleteProject = async (projectId: string) => {
    if (!user) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      // Verifica se o usuário é o criador do projeto
      const projectRef = doc(db, "projects", projectId)
      const projectSnap = await getDoc(projectRef)

      if (!projectSnap.exists()) {
        throw new Error("Projeto não encontrado")
      }

      const projectDoc = projectSnap.data() as Project

      if (projectDoc.creator.uid !== user.uid) {
        throw new Error("Você não tem permissão para excluir este projeto")
      }

      // Exclui as imagens do Storage
      if (projectDoc.coverImage) {
        const imageRef = ref(storage, projectDoc.coverImage)
        await deleteObject(imageRef)
      }

      for (const imageUrl of projectDoc.additionalImages) {
        const imageRef = ref(storage, imageUrl)
        await deleteObject(imageRef)
      }

      // Exclui o projeto
      await deleteDoc(projectRef)
    } catch (error) {
      console.error("Erro ao excluir projeto:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para obter um projeto específico
  const getProject = async (projectId: string) => {
    try {
      setLoading(true)

      const projectRef = doc(db, "projects", projectId)
      const projectSnap = await getDoc(projectRef)

      if (!projectSnap.exists()) {
        return null
      }

      const projectData = projectSnap.data()

      // Converte os timestamps do Firestore para Date
      const project: Project = {
        ...projectData,
        id: projectId,
        createdAt: projectData.createdAt?.toDate() || new Date(),
        updatedAt: projectData.updatedAt?.toDate() || new Date(),
        funding: {
          ...projectData.funding,
          deadline: projectData.funding.deadline?.toDate() || new Date(),
        },
        supporters: projectData.supporters.map((supporter: any) => ({
          ...supporter,
          timestamp: supporter.timestamp?.toDate() || new Date(),
        })),
        updates: projectData.updates.map((update: any) => ({
          ...update,
          date: update.date?.toDate() || new Date(),
        })),
      } as Project

      return project
    } catch (error) {
      console.error("Erro ao obter projeto:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para obter os projetos do usuário
  const getUserProjects = async () => {
    if (!user) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      const projectsQuery = query(
        collection(db, "projects"),
        where("creator.uid", "==", user.uid),
        orderBy("createdAt", "desc"),
      )

      const querySnapshot = await getDocs(projectsQuery)

      const projects: Project[] = []

      querySnapshot.forEach((doc) => {
        const projectData = doc.data()

        // Converte os timestamps do Firestore para Date
        const project: Project = {
          ...projectData,
          id: doc.id,
          createdAt: projectData.createdAt?.toDate() || new Date(),
          updatedAt: projectData.updatedAt?.toDate() || new Date(),
          funding: {
            ...projectData.funding,
            deadline: projectData.funding.deadline?.toDate() || new Date(),
          },
          supporters: projectData.supporters.map((supporter: any) => ({
            ...supporter,
            timestamp: supporter.timestamp?.toDate() || new Date(),
          })),
          updates: projectData.updates.map((update: any) => ({
            ...update,
            date: update.date?.toDate() || new Date(),
          })),
        } as Project

        projects.push(project)
      })

      return projects
    } catch (error) {
      console.error("Erro ao obter projetos do usuário:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para obter projetos recentes
  const getRecentProjects = async (limitCount = 5) => {
    try {
      setLoading(true)

      const projectsQuery = query(
        collection(db, "projects"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      )

      const querySnapshot = await getDocs(projectsQuery)

      const projects: Project[] = []

      querySnapshot.forEach((doc) => {
        const projectData = doc.data()

        // Converte os timestamps do Firestore para Date
        const project: Project = {
          ...projectData,
          id: doc.id,
          createdAt: projectData.createdAt?.toDate() || new Date(),
          updatedAt: projectData.updatedAt?.toDate() || new Date(),
          funding: {
            ...projectData.funding,
            deadline: projectData.funding.deadline?.toDate() || new Date(),
          },
          supporters: projectData.supporters.map((supporter: any) => ({
            ...supporter,
            timestamp: supporter.timestamp?.toDate() || new Date(),
          })),
          updates: projectData.updates.map((update: any) => ({
            ...update,
            date: update.date?.toDate() || new Date(),
          })),
        } as Project

        projects.push(project)
      })

      return projects
    } catch (error) {
      console.error("Erro ao obter projetos recentes:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para obter projetos populares
  const getPopularProjects = async (limitCount = 5) => {
    try {
      setLoading(true)

      const projectsQuery = query(
        collection(db, "projects"),
        where("status", "==", "active"),
        orderBy("funding.percentageFunded", "desc"),
        limit(limitCount),
      )

      const querySnapshot = await getDocs(projectsQuery)

      const projects: Project[] = []

      querySnapshot.forEach((doc) => {
        const projectData = doc.data()

        // Converte os timestamps do Firestore para Date
        const project: Project = {
          ...projectData,
          id: doc.id,
          createdAt: projectData.createdAt?.toDate() || new Date(),
          updatedAt: projectData.updatedAt?.toDate() || new Date(),
          funding: {
            ...projectData.funding,
            deadline: projectData.funding.deadline?.toDate() || new Date(),
          },
          supporters: projectData.supporters.map((supporter: any) => ({
            ...supporter,
            timestamp: supporter.timestamp?.toDate() || new Date(),
          })),
          updates: projectData.updates.map((update: any) => ({
            ...update,
            date: update.date?.toDate() || new Date(),
          })),
        } as Project

        projects.push(project)
      })

      return projects
    } catch (error) {
      console.error("Erro ao obter projetos populares:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para obter projetos que estão terminando em breve
  const getEndingSoonProjects = async (limitCount = 5) => {
    try {
      setLoading(true)

      const now = new Date()

      const projectsQuery = query(
        collection(db, "projects"),
        where("status", "==", "active"),
        where("funding.deadline", ">", now),
        orderBy("funding.deadline", "asc"),
        limit(limitCount),
      )

      const querySnapshot = await getDocs(projectsQuery)

      const projects: Project[] = []

      querySnapshot.forEach((doc) => {
        const projectData = doc.data()

        // Converte os timestamps do Firestore para Date
        const project: Project = {
          ...projectData,
          id: doc.id,
          createdAt: projectData.createdAt?.toDate() || new Date(),
          updatedAt: projectData.updatedAt?.toDate() || new Date(),
          funding: {
            ...projectData.funding,
            deadline: projectData.funding.deadline?.toDate() || new Date(),
          },
          supporters: projectData.supporters.map((supporter: any) => ({
            ...supporter,
            timestamp: supporter.timestamp?.toDate() || new Date(),
          })),
          updates: projectData.updates.map((update: any) => ({
            ...update,
            date: update.date?.toDate() || new Date(),
          })),
        } as Project

        projects.push(project)
      })

      return projects
    } catch (error) {
      console.error("Erro ao obter projetos que estão terminando em breve:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para adicionar uma atualização a um projeto
  const addProjectUpdate = async (projectId: string, update: Omit<ProjectUpdate, "id" | "date">) => {
    if (!user) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      // Verifica se o usuário é o criador do projeto
      const projectRef = doc(db, "projects", projectId)
      const projectSnap = await getDoc(projectRef)

      if (!projectSnap.exists()) {
        throw new Error("Projeto não encontrado")
      }

      const projectDoc = projectSnap.data() as Project

      if (projectDoc.creator.uid !== user.uid) {
        throw new Error("Você não tem permissão para adicionar atualizações a este projeto")
      }

      // Adiciona a atualização
      const newUpdate: ProjectUpdate = {
        id: Date.now().toString(),
        ...update,
        date: new Date(),
      }

      const updates = [...projectDoc.updates, newUpdate]

      await updateDoc(projectRef, {
        updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Erro ao adicionar atualização:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para fazer upload de uma imagem
  const uploadProjectImage = async (file: File) => {
    if (!user) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      // Cria uma referência única para a imagem
      const storageRef = ref(storage, `projects/${user.uid}/${Date.now()}_${file.name}`)

      // Faz o upload da imagem
      await uploadBytes(storageRef, file)

      // Obtém a URL da imagem
      const downloadURL = await getDownloadURL(storageRef)

      return downloadURL
    } catch (error) {
      console.error("Erro ao fazer upload de imagem:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para apoiar um projeto
  const supportProject = async (projectId: string, amount: number, shares: number) => {
    if (!user || !userProfile) throw new Error("Usuário não autenticado")

    try {
      setLoading(true)

      // Obtém o projeto
      const projectRef = doc(db, "projects", projectId)
      const projectSnap = await getDoc(projectRef)

      if (!projectSnap.exists()) {
        throw new Error("Projeto não encontrado")
      }

      const projectDoc = projectSnap.data() as Project

      // Verifica se o projeto está ativo
      if (projectDoc.status !== "active") {
        throw new Error("Este projeto não está aceitando apoios no momento")
      }

      // Verifica se há ações suficientes disponíveis
      if (shares > projectDoc.funding.sharesRemaining) {
        throw new Error("Não há ações suficientes disponíveis")
      }

      // Cria o novo apoiador
      const newSupporter: Supporter = {
        uid: user.uid,
        name: userProfile.displayName || "Usuário Anônimo",
        address: userProfile.walletAddress || "",
        amount,
        shares,
        timestamp: new Date(),
      }

      // Atualiza o projeto
      const newCurrent = projectDoc.funding.current + amount
      const newPercentageFunded = Math.min(100, Math.round((newCurrent / projectDoc.funding.target) * 100))
      const newSharesRemaining = projectDoc.funding.sharesRemaining - shares

      await updateDoc(projectRef, {
        supporters: [...projectDoc.supporters, newSupporter],
        "funding.current": newCurrent,
        "funding.percentageFunded": newPercentageFunded,
        "funding.sharesRemaining": newSharesRemaining,
        updatedAt: serverTimestamp(),
        // Se o projeto atingiu a meta, atualiza o status
        ...(newPercentageFunded >= 100 ? { status: "funded" } : {}),
      })

      // Adiciona o investimento ao histórico do usuário
      await addDoc(collection(db, "investments"), {
        userId: user.uid,
        projectId,
        projectName: projectDoc.name,
        amount,
        shares,
        timestamp: serverTimestamp(),
      })
    } catch (error) {
      console.error("Erro ao apoiar projeto:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getUserProjects,
    getRecentProjects,
    getPopularProjects,
    getEndingSoonProjects,
    addProjectUpdate,
    uploadProjectImage,
    supportProject,
    loading,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
