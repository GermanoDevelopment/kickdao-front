"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Rocket, User, LogOut, LayoutDashboard, PlusCircle, BarChart3 } from "lucide-react"

import { useAuth } from "@/context/auth.context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, userProfile, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const isActive = (path: string) => {
    if (path === "/") return pathname === path
    return pathname?.startsWith(path)
  }

  const navLinks = [
    { href: "/", label: "Início", icon: <Rocket className="h-4 w-4 mr-2" />, showWhen: "always" },
    {
      href: "/projects",
      label: "Projetos",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      showWhen: "always",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      showWhen: "authenticated",
    },
    {
      href: "/profile",
      label: "Perfil",
      icon: <User className="h-4 w-4 mr-2" />,
      showWhen: "authenticated",
    },
  ]

  const filteredNavLinks = navLinks.filter((link) => {
    if (link.showWhen === "always") return true
    if (link.showWhen === "authenticated" && user) return true
    return false
  })

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm dark:bg-soft-black/95" : "bg-white dark:bg-soft-black"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-dark-purple dark:text-electric-blue">
          <Rocket className="h-6 w-6 text-electric-blue" />
          <span>KickDAO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {filteredNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium flex items-center ${
                isActive(link.href)
                  ? "text-electric-blue dark:text-electric-blue"
                  : "text-soft-black dark:text-neutral-gray hover:text-electric-blue dark:hover:text-electric-blue"
              } hover:underline underline-offset-4`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {user && (
            <Button className="bg-electric-blue hover:bg-electric-blue/90 ml-2" size="sm" asChild>
              <Link href="/projects/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar Projeto
              </Link>
            </Button>
          )}
        </nav>

        {/* User Menu or Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.photoURL || ""} alt={userProfile?.displayName || ""} />
                    <AvatarFallback>
                      {userProfile?.displayName?.substring(0, 2) || user.email?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.displayName || "Usuário"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/projects/create" className="cursor-pointer">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Criar Projeto</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-coral-red focus:text-coral-red" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-4">
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
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 py-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-xl text-dark-purple dark:text-electric-blue"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Rocket className="h-6 w-6 text-electric-blue" />
                  <span>KickDAO</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {filteredNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-medium flex items-center ${
                        isActive(link.href)
                          ? "text-electric-blue dark:text-electric-blue"
                          : "text-soft-black dark:text-neutral-gray"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}

                  {user && (
                    <Link
                      href="/projects/create"
                      className="text-sm font-medium flex items-center text-electric-blue"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar Projeto
                    </Link>
                  )}

                  {user ? (
                    <Button
                      variant="ghost"
                      className="justify-start px-0 text-coral-red hover:text-coral-red/90 hover:bg-transparent"
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </Button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-sm font-medium flex items-center text-electric-blue"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/register"
                        className="text-sm font-medium flex items-center text-electric-blue"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Cadastrar
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
