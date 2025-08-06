"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  creator: string
  funded: number
  target: number
  daysLeft: number
  trending?: boolean
}

interface ProjectCarouselProps {
  projects: Project[]
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = direction === "left" ? -current.offsetWidth : current.offsetWidth
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  // Calculate percentage
  const calculatePercentage = (funded: number, target: number) => {
    return Math.min(Math.round((funded / target) * 100), 100)
  }

  return (
    <div className="relative">
      <div ref={carouselRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="min-w-[300px] max-w-[300px] snap-start border-electric-blue/20 hover:border-electric-blue/50 transition-all duration-200"
          >
            <div className="relative h-40 w-full">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-dark-purple text-white">
                  {project.category}
                </Badge>
              </div>
              {project.trending && (
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-solar-yellow/90 text-white border-solar-yellow">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Em alta
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                <div className="text-sm text-medium-gray">por {project.creator}</div>
                <Progress value={calculatePercentage(project.funded, project.target)} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{calculatePercentage(project.funded, project.target)}%</span>
                  <span className="text-medium-gray">{project.daysLeft} dias restantes</span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-medium-gray">Arrecadado:</span>
                  <span className="font-medium">{formatCurrency(project.funded)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-medium-gray">Meta:</span>
                  <span>{formatCurrency(project.target)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-electric-blue hover:bg-electric-blue/90" asChild>
                <Link href={`/projects/${project.id}`}>Ver Detalhes</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full shadow-md border-electric-blue/20 hover:bg-electric-blue/10 hover:border-electric-blue hidden md:flex"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Anterior</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full shadow-md border-electric-blue/20 hover:bg-electric-blue/10 hover:border-electric-blue hidden md:flex"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próximo</span>
      </Button>
    </div>
  )
}
