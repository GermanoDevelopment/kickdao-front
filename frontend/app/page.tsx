import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Rocket, Users, Zap, BarChart3, Shield, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white dark:bg-soft-black">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-dark-purple dark:text-electric-blue">
            <Rocket className="h-6 w-6 text-electric-blue" />
            <span>KickDAO</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#como-funciona"
              className="text-sm font-medium text-soft-black dark:text-neutral-gray hover:text-electric-blue dark:hover:text-electric-blue hover:underline underline-offset-4"
            >
              Como Funciona
            </Link>
            <Link
              href="#projetos"
              className="text-sm font-medium text-soft-black dark:text-neutral-gray hover:text-electric-blue dark:hover:text-electric-blue hover:underline underline-offset-4"
            >
              Projetos
            </Link>
            <Link
              href="#sobre"
              className="text-sm font-medium text-soft-black dark:text-neutral-gray hover:text-electric-blue dark:hover:text-electric-blue hover:underline underline-offset-4"
            >
              Sobre
            </Link>
          </nav>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-electric-blue text-electric-blue hover:bg-electric-blue/10"
              asChild
            >
              <Link href="/login">Entrar</Link>
            </Button>
            <Button className="bg-electric-blue hover:bg-electric-blue/90" asChild>
              <Link href="/register">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-hero-pattern text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Dê um Kick na sua ideia e permita-se crescer
                  </h1>
                  <p className="max-w-[600px] text-neutral-gray/90 md:text-xl">
                    Plataforma de crowdfunding descentralizada onde criadores e apoiadores se conectam diretamente
                    através de contratos inteligentes.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-electric-blue hover:bg-electric-blue/90 text-white" asChild>
                    <Link href="/projects/create">
                      Criar Projeto
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/projects">Explorar Projetos</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    alt="KickDAO Platform"
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-soft-black" id="sobre">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight gradient-text">
                  Seja impulsionado por pessoas que acreditam no seu potencial
                </h2>
                <p className="max-w-[900px] text-medium-gray md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A KickDAO conecta criadores com apoiadores que compartilham sua visão, permitindo que projetos
                  inovadores ganhem vida.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-electric-blue/20 shadow-md">
                <CardHeader className="pb-2">
                  <Zap className="h-10 w-10 mb-2 text-electric-blue" />
                  <CardTitle className="text-dark-purple">Financiamento Descentralizado</CardTitle>
                  <CardDescription>
                    Sem intermediários, taxas reduzidas e total transparência no processo de financiamento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-medium-gray">
                    Utilize contratos inteligentes para garantir que os fundos sejam distribuídos de forma justa e
                    transparente.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-electric-blue/20 shadow-md">
                <CardHeader className="pb-2">
                  <Users className="h-10 w-10 mb-2 text-electric-blue" />
                  <CardTitle className="text-dark-purple">Comunidade Engajada</CardTitle>
                  <CardDescription>
                    Conecte-se com pessoas que compartilham sua visão e ideal para seu projeto.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-medium-gray">
                    Construa uma base de apoiadores que não apenas financiam, mas também contribuem com ideias e
                    feedback.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-electric-blue/20 shadow-md">
                <CardHeader className="pb-2">
                  <Shield className="h-10 w-10 mb-2 text-electric-blue" />
                  <CardTitle className="text-dark-purple">Segurança Garantida</CardTitle>
                  <CardDescription>
                    Proteção para criadores e apoiadores através de contratos inteligentes auditados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-medium-gray">
                    Políticas de reembolso claras e mecanismos de proteção para garantir a confiança de todos os
                    envolvidos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-neutral-gray dark:bg-dark-purple/30" id="como-funciona">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-dark-purple dark:text-electric-blue">
                  Como Funciona
                </h2>
                <p className="max-w-[900px] text-medium-gray md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Crie seu projeto e seja financiado por pessoas que partilham sua visão e ideal.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric-blue text-white">
                    1
                  </div>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold text-dark-purple dark:text-electric-blue">Crie seu Projeto</h3>
                    <p className="text-medium-gray">
                      Defina seu projeto, estabeleça metas de financiamento e determine o valor por ação.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric-blue text-white">
                    2
                  </div>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold text-dark-purple dark:text-electric-blue">
                      Compartilhe sua Visão
                    </h3>
                    <p className="text-medium-gray">
                      Apresente seu projeto para a comunidade e explique por que ele merece ser financiado.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric-blue text-white">
                    3
                  </div>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold text-dark-purple dark:text-electric-blue">Receba Financiamento</h3>
                    <p className="text-medium-gray">
                      Apoiadores compram ações do seu projeto, fornecendo o capital necessário para realizá-lo.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric-blue text-white">
                    4
                  </div>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold text-dark-purple dark:text-electric-blue">
                      Desenvolva e Atualize
                    </h3>
                    <p className="text-medium-gray">
                      Mantenha seus apoiadores informados sobre o progresso do projeto com atualizações regulares.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Como funciona a KickDAO"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-b bg-white dark:bg-soft-black" id="projetos">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight gradient-text">
                  Impulsionando Projetos Inovadores
                </h2>
                <p className="max-w-[900px] text-medium-gray md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Junte-se a uma comunidade crescente de criadores e apoiadores.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 md:grid-cols-4 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-12 w-12 text-electric-blue" />
                <div className="text-3xl font-bold text-dark-purple dark:text-electric-blue">150+</div>
                <div className="text-sm text-medium-gray text-center">Projetos Financiados</div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <Users className="h-12 w-12 text-electric-blue" />
                <div className="text-3xl font-bold text-dark-purple dark:text-electric-blue">5.000+</div>
                <div className="text-sm text-medium-gray text-center">Usuários Ativos</div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <Zap className="h-12 w-12 text-electric-blue" />
                <div className="text-3xl font-bold text-dark-purple dark:text-electric-blue">R$ 2M+</div>
                <div className="text-sm text-medium-gray text-center">Financiamento Total</div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <Shield className="h-12 w-12 text-electric-blue" />
                <div className="text-3xl font-bold text-dark-purple dark:text-electric-blue">100%</div>
                <div className="text-sm text-medium-gray text-center">Segurança Garantida</div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button size="lg" className="bg-electric-blue hover:bg-electric-blue/90" asChild>
                <Link href="/projects">
                  Ver Projetos em Destaque
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 gradient-bg text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Pronto para dar um Kick na sua ideia?
                </h2>
                <p className="max-w-[900px] text-neutral-gray/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Junte-se a milhares de criadores que estão transformando suas ideias em realidade.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-white text-dark-purple hover:bg-white/90" asChild>
                  <Link href="/projects/create">Criar Projeto</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/projects">Explorar Projetos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-dark-purple text-white">
        <div className="container flex flex-col gap-6 py-8 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
              <Rocket className="h-6 w-6 text-electric-blue" />
              <span>KickDAO</span>
            </Link>
            <p className="text-sm text-neutral-gray/80">
              Plataforma de crowdfunding descentralizada para projetos inovadores.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-electric-blue">Plataforma</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/projects"
                    className="text-sm text-neutral-gray/80 hover:text-electric-blue hover:underline"
                  >
                    Projetos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-sm text-neutral-gray/80 hover:text-electric-blue hover:underline"
                  >
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-neutral-gray/80 hover:text-electric-blue hover:underline"
                  >
                    Preços
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-electric-blue">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-neutral-gray/80 hover:text-electric-blue hover:underline">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-neutral-gray/80 hover:text-electric-blue hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-neutral-gray/80 hover:text-electric-blue hover:underline"
                  >
                    Carreiras
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-electric-blue">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-neutral-gray/80 hover:text-electric-blue hover:underline"
                  >
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-neutral-gray/80 hover:text-electric-blue hover:underline">
                    Termos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-sm text-neutral-gray/80 hover:text-electric-blue hover:underline"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-6">
          <div className="container flex flex-col items-center justify-between gap-4 px-4 md:px-6 md:flex-row">
            <p className="text-xs text-neutral-gray/70">
              &copy; {new Date().getFullYear()} KickDAO. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-neutral-gray/70 hover:text-electric-blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-neutral-gray/70 hover:text-electric-blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-neutral-gray/70 hover:text-electric-blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-neutral-gray/70 hover:text-electric-blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
