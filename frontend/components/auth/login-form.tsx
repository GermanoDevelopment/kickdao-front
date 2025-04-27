"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { useAuth } from "@/context/auth.context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function LoginForm() {
  const { login, loginWithGoogle, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleDemoLogin = async () => {
    if (process.env.NODE_ENV !== "production") {
      try {
        setIsLoading(true)
        // Simulate successful login
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock user data for preview/development
        const mockUser = {
          uid: "demo-user-123",
          email: "demo@example.com",
          displayName: "Demo User",
          photoURL: null,
        }

        // Manually set user state (this is just for preview/development)
        // In a real app, this would be handled by Firebase
        localStorage.setItem("demoUser", JSON.stringify(mockUser))

        toast({
          title: "Demo login realizado com sucesso!",
          description: "Você está usando uma conta de demonstração.",
        })

        // Redirect to dashboard
        window.location.href = "/dashboard"
      } catch (error) {
        console.error("Erro no login de demonstração:", error)
        toast({
          title: "Erro no login de demonstração",
          description: "Ocorreu um erro ao fazer login de demonstração.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      await login(formData.email, formData.password)

      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para o dashboard.",
      })
    } catch (error: any) {
      console.error("Erro ao fazer login:", error)

      let errorMessage = "Verifique suas credenciais e tente novamente."

      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Email ou senha incorretos."
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas de login. Tente novamente mais tarde."
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente."
      } else if (error.code === "auth/internal-error") {
        errorMessage = "Erro interno do servidor. Tente novamente mais tarde."
      }

      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await loginWithGoogle()

      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para o dashboard.",
      })
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error)

      let errorMessage = "Ocorreu um erro ao fazer login com o Google. Tente novamente."

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "O popup de login foi fechado. Tente novamente."
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente."
      } else if (error.code === "auth/internal-error") {
        errorMessage = "Erro interno do servidor. Tente novamente mais tarde."
      }

      toast({
        title: "Erro ao fazer login com Google",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="nome@exemplo.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || authLoading}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="/forgot-password" className="text-sm font-medium text-electric-blue hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="current-password"
                disabled={isLoading || authLoading}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-medium-gray hover:text-dark-purple"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || authLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="bg-electric-blue hover:bg-electric-blue/90"
            disabled={isLoading || authLoading}
          >
            {(isLoading || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-medium-gray">Ou</span>
        </div>
      </div>
      <div className="grid gap-2">
        <Button variant="outline" type="button" onClick={handleGoogleLogin} disabled={isLoading || authLoading}>
          {(isLoading || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continuar com Google
        </Button>
        {process.env.NODE_ENV !== "production" && (
          <Button
            variant="outline"
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading || authLoading}
            className="bg-lime-green/10 text-lime-green border-lime-green hover:bg-lime-green/20"
          >
            {(isLoading || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Modo de Demonstração (Preview)
          </Button>
        )}
        <Button variant="outline" type="button" disabled={isLoading || authLoading}>
          Continuar com Metamask
        </Button>
      </div>
      <div className="text-center text-sm text-medium-gray">
        Não tem uma conta?{" "}
        <Link href="/register" className="text-electric-blue hover:underline">
          Registre-se
        </Link>
      </div>
    </div>
  )
}
