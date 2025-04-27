import type { Metadata } from "next"

import { ProjectCarousel } from "@/components/projects/project-carousel"
import { ProjectFilter } from "@/components/projects/project-filter"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Projetos | Kick DAO",
  description: "Explore os projetos disponíveis na Kick DAO",
}

export default function ProjectsPage() {
  // Dados simulados para os projetos
  const recentProjects = [
    {
      id: "1",
      title: "EcoTech Solar Panels",
      description: "Painéis solares de alta eficiência que podem gerar até 30% mais energia.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Energia Renovável",
      creator: "Maria Silva",
      funded: 75000,
      target: 100000,
      daysLeft: 15,
      trending: true,
    },
    {
      id: "2",
      title: "AquaPure Filter",
      description: "Sistema de filtragem de água que remove 99.9% dos contaminantes.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Sustentabilidade",
      creator: "Carlos Eduardo",
      funded: 25000,
      target: 50000,
      daysLeft: 20,
    },
    {
      id: "3",
      title: "Smart Urban Garden",
      description: "Sistema automatizado para cultivo de vegetais em ambientes urbanos.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Agricultura",
      creator: "Ana Luiza",
      funded: 40000,
      target: 60000,
      daysLeft: 10,
    },
    {
      id: "4",
      title: "BioPlastic Packaging",
      description: "Embalagens biodegradáveis feitas de resíduos agrícolas.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Sustentabilidade",
      creator: "Pedro Henrique",
      funded: 30000,
      target: 45000,
      daysLeft: 25,
    },
    {
      id: "5",
      title: "Wind Micro-Turbines",
      description: "Micro-turbinas eólicas para geração de energia em residências.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Energia Renovável",
      creator: "Juliana Costa",
      funded: 55000,
      target: 80000,
      daysLeft: 18,
      trending: true,
    },
  ]

  const popularProjects = [
    {
      id: "6",
      title: "Organic Vertical Farm",
      description: "Fazenda vertical para cultivo de alimentos orgânicos em espaços urbanos.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Agricultura",
      creator: "Roberto Almeida",
      funded: 120000,
      target: 150000,
      daysLeft: 8,
      trending: true,
    },
    {
      id: "7",
      title: "Ocean Plastic Collector",
      description: "Sistema autônomo para coleta de plásticos nos oceanos.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Meio Ambiente",
      creator: "Fernanda Lima",
      funded: 200000,
      target: 250000,
      daysLeft: 12,
      trending: true,
    },
    {
      id: "8",
      title: "Sustainable Fashion",
      description: "Linha de roupas produzidas com materiais reciclados e processos sustentáveis.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Moda",
      creator: "Camila Santos",
      funded: 80000,
      target: 100000,
      daysLeft: 5,
    },
    {
      id: "9",
      title: "Electric Bike Sharing",
      description: "Sistema de compartilhamento de bicicletas elétricas para cidades.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Mobilidade",
      creator: "Lucas Oliveira",
      funded: 180000,
      target: 200000,
      daysLeft: 7,
      trending: true,
    },
    {
      id: "10",
      title: "Smart Recycling Bins",
      description: "Lixeiras inteligentes que classificam automaticamente os resíduos.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Sustentabilidade",
      creator: "Mariana Costa",
      funded: 60000,
      target: 75000,
      daysLeft: 9,
    },
  ]

  const endingSoonProjects = [
    {
      id: "11",
      title: "Eco-friendly Packaging",
      description: "Embalagens compostáveis para alimentos e produtos.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Sustentabilidade",
      creator: "Gabriel Martins",
      funded: 45000,
      target: 50000,
      daysLeft: 2,
    },
    {
      id: "12",
      title: "Community Solar",
      description: "Projeto de energia solar compartilhada para comunidades.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Energia Renovável",
      creator: "Beatriz Souza",
      funded: 95000,
      target: 100000,
      daysLeft: 3,
      trending: true,
    },
    {
      id: "13",
      title: "Biodegradable Utensils",
      description: "Talheres e utensílios biodegradáveis feitos de materiais naturais.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Sustentabilidade",
      creator: "Rodrigo Lima",
      funded: 28000,
      target: 30000,
      daysLeft: 1,
    },
    {
      id: "14",
      title: "Water Conservation System",
      description: "Sistema de conservação e reuso de água para residências.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Água",
      creator: "Carolina Mendes",
      funded: 38000,
      target: 40000,
      daysLeft: 2,
    },
    {
      id: "15",
      title: "Sustainable Building Materials",
      description: "Materiais de construção sustentáveis feitos de resíduos reciclados.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Construção",
      creator: "Felipe Santos",
      funded: 85000,
      target: 90000,
      daysLeft: 3,
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-purple">Projetos</h1>
          <p className="text-medium-gray">Explore os projetos disponíveis para investimento</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-electric-blue hover:bg-electric-blue/90" asChild>
          <Link href="/projects/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Projeto
          </Link>
        </Button>
      </div>

      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-2xl font-bold text-dark-purple">Recentemente Lançados</h2>
          <ProjectFilter defaultValue="24h" />
        </div>
        <ProjectCarousel projects={recentProjects} />
      </section>

      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-2xl font-bold text-dark-purple">Mais Populares</h2>
          <ProjectFilter defaultValue="1w" />
        </div>
        <ProjectCarousel projects={popularProjects} />
      </section>

      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-2xl font-bold text-dark-purple">Quase Finalizados</h2>
          <ProjectFilter defaultValue="1m" />
        </div>
        <ProjectCarousel projects={endingSoonProjects} />
      </section>
    </div>
  )
}
