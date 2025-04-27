"use client"

import { useContract } from "@/context/contract.context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, Loader2, Wallet } from "lucide-react"
import { useState } from "react"

export function KdaoTokenInfo() {
  const { connected, connecting, hasKdaoToken, kdaoTokenId, kdaoTokenLoading, connectWallet, mintKdaoToken } =
    useContract()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnectWallet = async () => {
    await connectWallet()
  }

  const handleMintToken = async () => {
    setIsLoading(true)
    await mintKdaoToken()
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token KDAO</CardTitle>
        <CardDescription>
          O token KDAO dá acesso a funcionalidades exclusivas na plataforma, como criar projetos e fazer investimentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {kdaoTokenLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
            <span className="ml-2">Verificando token...</span>
          </div>
        ) : connected ? (
          hasKdaoToken ? (
            <div className="bg-lime-green/10 p-4 rounded-lg border border-lime-green/30">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-lime-green mr-2" />
                <span className="font-medium">Token KDAO verificado</span>
              </div>
              <p className="text-sm mt-2">
                Você possui o token KDAO #{kdaoTokenId} e tem acesso completo à plataforma.
              </p>
            </div>
          ) : (
            <div className="bg-coral-red/10 p-4 rounded-lg border border-coral-red/30">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-coral-red mr-2" />
                <span className="font-medium">Token KDAO não encontrado</span>
              </div>
              <p className="text-sm mt-2">
                Você não possui um token KDAO. Adquira um token para ter acesso completo à plataforma.
              </p>
            </div>
          )
        ) : (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="font-medium">Carteira não conectada</span>
            </div>
            <p className="text-sm mt-2">Conecte sua carteira Ethereum para verificar ou adquirir um token KDAO.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!connected ? (
          <Button
            className="w-full bg-electric-blue hover:bg-electric-blue/90"
            onClick={handleConnectWallet}
            disabled={connecting}
          >
            {connecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Wallet className="mr-2 h-4 w-4" />
            Conectar Carteira
          </Button>
        ) : !hasKdaoToken ? (
          <Button
            className="w-full bg-electric-blue hover:bg-electric-blue/90"
            onClick={handleMintToken}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Adquirir Token KDAO (0.1 ETH)
          </Button>
        ) : (
          <Button className="w-full bg-lime-green hover:bg-lime-green/90" disabled>
            <Check className="mr-2 h-4 w-4" />
            Token KDAO Ativo
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
