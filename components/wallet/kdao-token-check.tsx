"use client"

import { useState } from "react"
import { useContract } from "@/context/contract.context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check, Loader2, Wallet } from "lucide-react"

interface KdaoTokenCheckProps {
  onSuccess?: () => void
  showCard?: boolean
}

export function KdaoTokenCheck({ onSuccess, showCard = true }: KdaoTokenCheckProps) {
  const { connected, connecting, hasKdaoToken, kdaoTokenLoading, connectWallet, mintKdaoToken } = useContract()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnectWallet = async () => {
    // await connectWallet()

    // if (onSuccess && hasKdaoToken) {
    //   onSuccess()
    // }
    if (onSuccess) {
      onSuccess()
    }
  }

  const handleMintToken = async () => {
    setIsLoading(true)
    const success = await mintKdaoToken()
    setIsLoading(false)

    if (success && onSuccess) {
      onSuccess()
    }
  }

  if (!showCard) {
    return (
      <Alert variant={hasKdaoToken ? "default" : "destructive"} className="mb-6">
        {hasKdaoToken ? (
          <>
            <Check className="h-4 w-4" />
            <AlertTitle>Token KDAO verificado</AlertTitle>
            <AlertDescription>Você possui um token KDAO e tem acesso completo à plataforma.</AlertDescription>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Token KDAO necessário</AlertTitle>
            <AlertDescription>
              Você precisa ter um token KDAO para acessar esta funcionalidade.
              {!connected && " Conecte sua carteira para continuar."}
              {connected && " Adquira um token KDAO para continuar."}
            </AlertDescription>
          </>
        )}
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificação de Token KDAO</CardTitle>
        <CardDescription>Para criar projetos e fazer investimentos, você precisa ter um token KDAO.</CardDescription>
      </CardHeader>
      <CardContent>
        {kdaoTokenLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
            <span className="ml-2">Verificando token...</span>
          </div>
        ) : hasKdaoToken ? (
          <div className="bg-lime-green/10 p-4 rounded-lg border border-lime-green/30">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-lime-green mr-2" />
              <span className="font-medium">Token KDAO verificado</span>
            </div>
            <p className="text-sm mt-2">Você possui um token KDAO e tem acesso completo à plataforma.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {!connected ? (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-medium">Carteira não conectada</span>
                </div>
                <p className="text-sm mt-2">Conecte sua carteira Ethereum para verificar ou adquirir um token KDAO.</p>
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
            )}
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
          <Button className="w-full bg-lime-green hover:bg-lime-green/90" onClick={onSuccess}>
            <Check className="mr-2 h-4 w-4" />
            Continuar
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
