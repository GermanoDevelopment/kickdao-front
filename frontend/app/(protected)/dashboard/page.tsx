"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, CreditCard, DollarSign, FileText, Plus, Rocket, Settings, User, Wallet } from "lucide-react"

import { useAuth } from "@/context/auth.context"
import { useProject } from "@/context/project.context"
import { useInvestment } from "@/context/investment.context"
import type { Project } from "@/context/project.context"
import type { Investment } from "@/context/investment.context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const router = useRouter()
  const { user, userProfile, loading: authLoading } = useAuth()
  const { getUserProjects, loading: projectLoading } = useProject()
  const { getUserInvestments, getTotalInvested, loading: investmentLoading } = useInvestment()

  const [projects, setProjects] = useState<Project[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [totalInvested, setTotalInvested] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dataFetched, setDataFetched] = useState(false)

  useEffect(() => {
    // Redireciona para a página de login se o usuário não estiver autenticado
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (user && !dataFetched) {
        try {
          setLoading(true)

          // Busca os projetos do usuário
          const userProjects = await getUserProjects()
          setProjects(userProjects)

          // Busca os investimentos do usuário
          const userInvestments = await getUserInvestments()
          setInvestments(userInvestments)

          // Busca o total investido pelo usuário
          const total = await getTotalInvested()
          setTotalInvested(total)

          setDataFetched(true)
        } catch (error) {
          console.error("Erro ao buscar dados do dashboard:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [user, getUserProjects, getUserInvestments, getTotalInvested, dataFetched])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(date)
  }

  // Calculate days remaining
  const getDaysRemaining = (deadline: Date) => {
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  // Determine which tab to show based on URL query parameter
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const tabId = hash.substring(1) // Remove the # character
      const tabElement = document.getElementById(tabId)
      if (tabElement) {
        tabElement.click()
      }
    }
  }, [])

  if (authLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Skeleton className="h-12 w-64 mb-4 mx-auto" />
            <Skeleton className="h-4 w-48 mb-8 mx-auto" />
            <Skeleton className="h-10 w-32 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-purple">Dashboard</h1>
          <p className="text-medium-gray">Bem-vindo de volta, {userProfile?.displayName || "Usuário"}!</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Link>
          </Button>
          <Button className="bg-electric-blue hover:bg-electric-blue/90" asChild>
            <Link href="/projects/create">
              <Plus className="mr-2 h-4 w-4" />
              Criar Projeto
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Projetos Criados</CardTitle>
            <CardDescription>Total de projetos que você criou</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Rocket className="h-10 w-10 text-electric-blue mr-4" />
              <div className="text-3xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : projects.length}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="text-electric-blue" asChild>
              <Link href="#projects" onClick={() => document.getElementById("projects-tab")?.click()}>
                Ver todos os projetos
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Investimentos</CardTitle>
            <CardDescription>Total de projetos que você apoiou</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-10 w-10 text-electric-blue mr-4" />
              <div className="text-3xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : investments.length}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="text-electric-blue" asChild>
              <Link href="#investments" onClick={() => document.getElementById("investments-tab")?.click()}>
                Ver investimentos
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Investido</CardTitle>
            <CardDescription>Valor total investido em projetos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-10 w-10 text-electric-blue mr-4" />
              <div className="text-3xl font-bold">
                {loading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalInvested)}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="text-electric-blue" asChild>
              <Link href="#investments" onClick={() => document.getElementById("investments-tab")?.click()}>
                Ver detalhes
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="projects" id="projects-tab">
            Meus Projetos
          </TabsTrigger>
          <TabsTrigger value="investments" id="investments-tab">
            Meus Investimentos
          </TabsTrigger>
          <TabsTrigger value="account" id="account-tab">
            Conta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" id="projects">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-dark-purple">Projetos Criados</h2>
            <Button className="bg-electric-blue hover:bg-electric-blue/90" asChild>
              <Link href="/projects/create">
                <Plus className="mr-2 h-4 w-4" />
                Novo Projeto
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-2 w-full mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="border-electric-blue/20 hover:border-electric-blue/50 transition-all duration-200"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>
                          {project.category} • Criado em {formatDate(project.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-gray">
                        {project.status === "pending" && "Pendente"}
                        {project.status === "active" && "Ativo"}
                        {project.status === "funded" && "Financiado"}
                        {project.status === "completed" && "Concluído"}
                        {project.status === "cancelled" && "Cancelado"}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <Progress value={project.funding.percentageFunded} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{project.funding.percentageFunded}% financiado</span>
                        <span className="text-medium-gray">
                          {getDaysRemaining(project.funding.deadline)} dias restantes
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-medium-gray">Arrecadado:</span>
                        <span className="font-medium">{formatCurrency(project.funding.current)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-medium-gray">Meta:</span>
                        <span>{formatCurrency(project.funding.target)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/projects/${project.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          Detalhes
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/projects/${project.id}/edit`}>
                          <Settings className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Nenhum projeto encontrado</CardTitle>
                <CardDescription>Você ainda não criou nenhum projeto.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-medium-gray">
                  Crie seu primeiro projeto e comece a receber financiamento para suas ideias.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="bg-electric-blue hover:bg-electric-blue/90" asChild>
                  <Link href="/projects/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Projeto
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="investments" id="investments">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-dark-purple">Meus Investimentos</h2>
            <Button className="bg-electric-blue hover:bg-electric-blue/90" asChild>
              <Link href="/projects">
                <BarChart3 className="mr-2 h-4 w-4" />
                Explorar Projetos
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-2 w-full mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : investments.length > 0 ? (
            <div className="space-y-4">
              {investments.map((investment) => (
                <Card key={investment.id} className="border-electric-blue/20">
                  <CardHeader className="pb-2">
                    <CardTitle>{investment.projectName}</CardTitle>
                    <CardDescription>Investido em {formatDate(investment.timestamp)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-medium-gray">Valor investido</p>
                        <p className="text-lg font-bold">{formatCurrency(investment.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-medium-gray">Ações adquiridas</p>
                        <p className="text-lg font-bold">{investment.shares}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/projects/${investment.projectId}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Projeto
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Nenhum investimento encontrado</CardTitle>
                <CardDescription>Você ainda não investiu em nenhum projeto.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-medium-gray">
                  Explore os projetos disponíveis e comece a investir em ideias inovadoras.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="bg-electric-blue hover:bg-electric-blue/90" asChild>
                  <Link href="/projects">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Explorar Projetos
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="account" id="account">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>Seus dados pessoais e configurações</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={userProfile?.photoURL || ""} alt={userProfile?.displayName || ""} />
                        <AvatarFallback>
                          {userProfile?.displayName?.substring(0, 2) || user.email?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{userProfile?.displayName || "Usuário"}</h3>
                        <p className="text-medium-gray">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-medium-gray">Localização</p>
                        <p className="font-medium">{userProfile?.location || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-medium-gray">Website</p>
                        <p className="font-medium">{userProfile?.website || "Não informado"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-medium-gray">Biografia</p>
                      <p className="font-medium">{userProfile?.bio || "Não informado"}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carteira Digital</CardTitle>
                <CardDescription>Informações da sua carteira</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : userProfile?.walletAddress ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-electric-blue" />
                      <span className="font-medium">
                        {userProfile.walletType?.charAt(0).toUpperCase() + userProfile.walletType?.slice(1) ||
                          "Ethereum"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-medium-gray">Endereço</p>
                      <p className="font-mono text-sm truncate">{userProfile.walletAddress}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Wallet className="h-12 w-12 text-medium-gray mx-auto mb-2" />
                    <p className="text-medium-gray">Nenhuma carteira conectada</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/profile?tab=wallet">
                    {userProfile?.walletAddress ? "Gerenciar Carteira" : "Conectar Carteira"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
