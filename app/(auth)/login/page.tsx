import Link from "next/link"
import type { Metadata } from "next"
import { Rocket } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Kick DAO",
  description: "Faça login na sua conta Kick DAO",
}

export default function LoginPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Rocket className="mr-2 h-6 w-6 text-electric-blue" />
          <Link href="/" className="text-electric-blue">
            Kick DAO
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "A Kick DAO me permitiu transformar minha ideia em realidade. O processo de financiamento foi transparente
              e a comunidade incrível!"
            </p>
            <footer className="text-sm text-neutral-gray/90">Sofia Mendes, Fundadora da EcoTech</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-dark-purple">Bem-vindo de volta</h1>
            <p className="text-sm text-medium-gray">Entre com seu email e senha para acessar sua conta</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-medium-gray">
            Ao continuar, você concorda com nossos{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-electric-blue">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-electric-blue">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
