"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumb() {
  const pathname = usePathname()

  if (!pathname || pathname === "/") return null

  const pathSegments = pathname.split("/").filter(Boolean)

  // Mapeamento de segmentos para nomes mais amigáveis
  const segmentNames: Record<string, string> = {
    projects: "Projetos",
    dashboard: "Dashboard",
    profile: "Perfil",
    create: "Criar",
    login: "Login",
    register: "Cadastro",
  }

  return (
    <nav className="flex items-center text-sm text-medium-gray py-4 px-4 md:px-6">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-electric-blue flex items-center">
            <Home className="h-4 w-4" />
            <span className="sr-only">Início</span>
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          // Construir o caminho até este segmento
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`
          const isLast = index === pathSegments.length - 1

          // Verificar se é um ID (para páginas de detalhes de projeto)
          const isId = segment.length > 8 && !segmentNames[segment]
          const displayName = isId
            ? "Detalhes"
            : segmentNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <li key={segment} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              {isLast ? (
                <span className="font-medium text-dark-purple">{displayName}</span>
              ) : (
                <Link href={href} className="hover:text-electric-blue">
                  {displayName}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
