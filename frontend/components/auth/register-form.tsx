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

export function RegisterForm() {
  const { register, loginWithGoogle, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpar erro quando o usuário começa a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório"
      valid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
      valid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres"
      valid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      await register(formData.email, formData.password, formData.fullName)

      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para completar seu perfil.",
      })
    } catch (error: any) {
      console.error("Erro ao criar conta:", error)

      let errorMessage = "Ocorreu um erro ao criar sua conta. Tente novamente."

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso. Tente fazer login ou use outro email."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha é muito fraca. Use uma senha mais forte."
      }

      toast({
        title: "Erro ao criar conta",
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
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para o dashboard.",
      })
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error)

      toast({
        title: "Erro ao criar conta com Google",
        description: "Ocorreu um erro ao criar sua conta com o Google. Tente novamente.",
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
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Seu nome completo"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              disabled={isLoading || authLoading}
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <p className="text-xs text-coral-red">{errors.fullName}</p>}
          </div>
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
            {errors.email && <p className="text-xs text-coral-red">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="new-password"
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
            {errors.password && <p className="text-xs text-coral-red">{errors.password}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading || authLoading}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="text-xs text-coral-red">{errors.confirmPassword}</p>}
          </div>
          <Button
            type="submit"
            className="bg-electric-blue hover:bg-electric-blue/90"
            disabled={isLoading || authLoading}
          >
            {(isLoading || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Conta
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
        <Button variant="outline" type="button" disabled={isLoading || authLoading}>
          Continuar com Metamask
        </Button>
      </div>
      <div className="text-center text-sm text-medium-gray">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-electric-blue hover:underline">
          Faça login
        </Link>
      </div>
    </div>
  )
}
