import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Clock, Users, AlertCircle, ChevronRight } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PurchaseShares from "./purchase-shares"

export const metadata: Metadata = {
  title: "Projeto Detalhes | Kick DAO",
  description: "Detalhes do projeto de crowdfunding",
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  // This would be fetched from your API/blockchain in a real implementation
  const project = {
    id: params.id,
    name: "EcoTech Solar Panels",
    category: "Energia Renovável",
    description:
      "A EcoTech está desenvolvendo painéis solares de alta eficiência que podem gerar até 30% mais energia que os painéis convencionais. Nossa tecnologia proprietária utiliza novos materiais que aumentam a absorção de luz e melhoram a conversão de energia, mesmo em condições de pouca luz. Além disso, nossos painéis são produzidos com materiais recicláveis e têm uma vida útil estimada de 30 anos, superior à média do mercado. Com o financiamento, pretendemos escalar a produção e reduzir os custos, tornando energia limpa mais acessível para todos.",
    coverImage: "/placeholder.svg?height=600&width=1200",
    creator: {
      name: "Maria Silva",
      address: "0x1a2b3c4d5e6f7g8h9i0j",
      ens: "mariasilva.eth",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    funding: {
      current: 75000,
      target: 100000,
      percentageFunded: 75,
      pricePerShare: 100,
      sharesRemaining: 250,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    },
    supporters: [
      {
        name: "João Pedro",
        address: "0xabcd...1234",
        amount: 5000,
        shares: 50,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Ana Luiza",
        address: "0xefgh...5678",
        amount: 3000,
        shares: 30,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Carlos Eduardo",
        address: "0xijkl...9012",
        amount: 10000,
        shares: 100,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
    updates: [
      {
        id: "1",
        title: "Primeiro protótipo finalizado",
        content:
          "Temos o prazer de anunciar que finalizamos o primeiro protótipo funcional dos nossos painéis solares. Os testes iniciais mostram resultados promissores, com eficiência 28% maior que os painéis convencionais.",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        title: "Parceria com laboratório de pesquisa",
        content:
          "Estabelecemos uma parceria com o Laboratório de Energias Renováveis da Universidade Federal para testes avançados e certificação da nossa tecnologia.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
    refundPolicy:
      "Em caso de não atingimento da meta de financiamento até o prazo final, todos os apoiadores receberão o reembolso integral dos valores investidos. Se o projeto for financiado com sucesso mas falhar em entregar os resultados prometidos em até 12 meses, os apoiadores poderão solicitar reembolso parcial conforme termos do contrato inteligente.",
  }

  // Calculate days remaining
  const daysRemaining = Math.ceil((project.funding.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(date)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Cover Image */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
        <Image
          src={project.coverImage || "/placeholder.svg"}
          alt={project.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{project.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {daysRemaining} dias restantes
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.name}</h1>

            {/* Creator Info */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar>
                <AvatarImage src={project.creator.avatar || "/placeholder.svg"} alt={project.creator.name} />
                <AvatarFallback>{project.creator.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{project.creator.name}</div>
                <div className="text-sm text-muted-foreground">{project.creator.ens || project.creator.address}</div>
              </div>
            </div>

            {/* Project Description */}
            <div className="prose max-w-none">
              <p className="text-lg">{project.description}</p>
            </div>
          </div>

          {/* Tabs for Supporters, Updates, and Refund Policy */}
          <Tabs defaultValue="supporters" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="supporters">Apoiadores</TabsTrigger>
              <TabsTrigger value="updates">Atualizações</TabsTrigger>
              <TabsTrigger value="refund">Política de Reembolso</TabsTrigger>
            </TabsList>

            <TabsContent value="supporters" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Apoiadores ({project.supporters.length})
                  </CardTitle>
                  <CardDescription>Pessoas que já apoiaram este projeto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.supporters.map((supporter, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{supporter.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{supporter.name}</div>
                            <div className="text-sm text-muted-foreground">{supporter.address}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(supporter.amount)}</div>
                          <div className="text-sm text-muted-foreground">
                            {supporter.shares} ações • {formatDate(supporter.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="updates" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Atualizações do Projeto</CardTitle>
                  <CardDescription>Últimas novidades compartilhadas pelo criador</CardDescription>
                </CardHeader>
                <CardContent>
                  {project.updates.length > 0 ? (
                    <div className="space-y-6">
                      {project.updates.map((update) => (
                        <div key={update.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">{update.title}</h3>
                            <span className="text-sm text-muted-foreground">{formatDate(update.date)}</span>
                          </div>
                          <p>{update.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">Nenhuma atualização disponível ainda.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="refund" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Política de Reembolso
                  </CardTitle>
                  <CardDescription>Informações sobre como funciona o reembolso neste projeto</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{project.refundPolicy}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Funding Status and Purchase Card */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Status do Financiamento</CardTitle>
              <CardDescription>
                {formatCurrency(project.funding.current)} arrecadados de {formatCurrency(project.funding.target)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={project.funding.percentageFunded} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{project.funding.percentageFunded}% financiado</span>
                  <span className="text-muted-foreground">{daysRemaining} dias restantes</span>
                </div>
              </div>

              <Separator />

              {/* Share Information */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preço por ação:</span>
                  <span className="font-medium">{formatCurrency(project.funding.pricePerShare)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ações restantes:</span>
                  <span className="font-medium">{project.funding.sharesRemaining}</span>
                </div>
              </div>

              <Separator />

              {/* Purchase Form */}
              <PurchaseShares
                pricePerShare={project.funding.pricePerShare}
                maxShares={project.funding.sharesRemaining}
                projectId={project.id}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-muted-foreground">
                Ao apoiar este projeto, você concorda com os termos e condições da Kick DAO.
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/projects">
                  Ver outros projetos
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
