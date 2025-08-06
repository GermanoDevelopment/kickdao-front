"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase-config"
import { useRouter } from "next/navigation"

// Definição dos tipos
interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  bio?: string
  location?: string
  website?: string
  walletAddress?: string
  walletType?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  register: (email: string, password: string, fullName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  setWalletInfo: (walletAddress: string, walletType: string) => Promise<void>
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

// Provider do contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Observa mudanças no estado de autenticação
  useEffect(() => {
    // Check for demo user in non-production environments
    const checkDemoUser = async () => {
      if (process.env.NODE_ENV !== "production") {
        const demoUser = localStorage.getItem("demoUser")
        if (demoUser) {
          const parsedUser = JSON.parse(demoUser)
          // Create a mock user profile
          const mockProfile: UserProfile = {
            uid: parsedUser.uid,
            email: parsedUser.email,
            displayName: parsedUser.displayName,
            photoURL: parsedUser.photoURL,
            bio: "This is a demo user for preview/development.",
            location: "Demo City, Demo Country",
            website: "https://example.com",
            createdAt: new Date(),
          }
          setUserProfile(mockProfile)
          setLoading(false)
          return true
        }
      }
      return false
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        // Busca o perfil do usuário no Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile)
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
          // Continue without profile data
        }
      } else {
        // If no Firebase user, check for demo user
        const isDemoUser = await checkDemoUser()
        if (!isDemoUser) {
          setUserProfile(null)
        }
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Função para registrar um novo usuário
  const register = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Atualiza o nome de exibição do usuário
      await updateProfile(user, {
        displayName: fullName,
      })

      // Cria um documento para o usuário no Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        photoURL: user.photoURL,
        createdAt: new Date(),
      }

      await setDoc(doc(db, "users", user.uid), userProfile)
      setUserProfile(userProfile)

      router.push("/profile")
    } catch (error) {
      console.error("Erro ao registrar:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para fazer login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Add retry logic for network issues
      const maxRetries = 3
      let retryCount = 0
      let success = false

      while (!success && retryCount < maxRetries) {
        try {
          await signInWithEmailAndPassword(auth, email, password)
          success = true
        } catch (error: any) {
          if (error.code === "auth/network-request-failed") {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000))
            retryCount++

            if (retryCount >= maxRetries) {
              throw error
            }
          } else {
            throw error
          }
        }
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para fazer login com Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()

      // Add retry logic for network issues
      const maxRetries = 3
      let retryCount = 0
      let result

      while (!result && retryCount < maxRetries) {
        try {
          result = await signInWithPopup(auth, provider)
        } catch (error: any) {
          if (error.code === "auth/network-request-failed") {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000))
            retryCount++

            if (retryCount >= maxRetries) {
              throw error
            }
          } else {
            throw error
          }
        }
      }

      if (!result) {
        throw new Error("Failed to authenticate with Google")
      }

      const user = result.user

      // Verifica se o usuário já existe no Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        // Se não existir, cria um novo documento
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
        }

        await setDoc(doc(db, "users", user.uid), userProfile)
        setUserProfile(userProfile)
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para fazer logout
  const logout = async () => {
    try {
      setLoading(true)

      // Check if we're using a demo user
      if (process.env.NODE_ENV !== "production" && localStorage.getItem("demoUser")) {
        localStorage.removeItem("demoUser")
        setUser(null)
        setUserProfile(null)
      } else {
        await signOut(auth)
      }

      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para redefinir senha
  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Erro ao redefinir senha:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para atualizar o perfil do usuário
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return

    try {
      setLoading(true)

      // Atualiza o documento no Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...userProfile,
          ...data,
        },
        { merge: true },
      )

      // Atualiza o estado local
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null))

      // Se o nome for atualizado, atualiza também no Auth
      if (data.displayName) {
        await updateProfile(user, {
          displayName: data.displayName,
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para definir informações da carteira
  const setWalletInfo = async (walletAddress: string, walletType: string) => {
    if (!user) return

    try {
      setLoading(true)

      await updateUserProfile({
        walletAddress,
        walletType,
      })
    } catch (error) {
      console.error("Erro ao definir informações da carteira:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    setWalletInfo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
