"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Check, Copy, Loader2, Wallet } from "lucide-react"

import { useAuth } from "@/context/auth.context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export function WalletForm() {
  const { userProfile, setWalletInfo, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletType, setWalletType] = useState("ethereum")
  const [walletAddress, setWalletAddress] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (userProfile?.walletAddress) {
      setWalletConnected(true)
      setWalletAddress(userProfile.walletAddress)
      setWalletType(userProfile.walletType || "ethereum")
    }
  }, [userProfile])

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true)

      // Simulação de conexão com wallet - aqui você integraria com Web3
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulando endereço de wallet
      const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
      setWalletAddress(mockAddress)

      // Salva as informações da carteira no perfil do usuário
      await setWalletInfo(mockAddress, walletType)

      setWalletConnected(true)

      toast({
        title: "Carteira conectada",
        description: "Sua carteira foi conectada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao conectar carteira:", error)

      toast({
        title: "Erro ao conectar carteira",
        description: "Ocorreu um erro ao conectar sua carteira. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      setIsLoading(true)

      // Limpa as informações da carteira no perfil do usuário
      await setWalletInfo("", "")

      setWalletAddress("")
      setWalletConnected(false)

      toast({
        title: "Carteira desconectada",
        description: "Sua carteira foi desconectada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao desconectar carteira:", error)

      toast({
        title: "Erro ao desconectar carteira",
        description: "Ocorreu um erro ao desconectar sua carteira.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Endereço copiado",
      description: "Endereço da carteira copiado para a área de transferência.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carteira Digital</CardTitle>
        <CardDescription>Conecte sua carteira digital para participar de projetos e receber fundos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!walletConnected ? (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Você precisa conectar uma carteira digital para criar projetos ou receber fundos na plataforma.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Label>Tipo de Carteira</Label>
              <RadioGroup
                defaultValue={walletType}
                onValueChange={setWalletType}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                <div>
                  <RadioGroupItem
                    value="ethereum"
                    id="ethereum"
                    className="peer sr-only"
                    disabled={isLoading || authLoading}
                  />
                  <Label
                    htmlFor="ethereum"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-electric-blue [&:has([data-state=checked])]:bg-electric-blue/10"
                  >
                    <div className="mb-2 rounded-md bg-neutral-gray p-2">
                      <Wallet className="h-6 w-6 text-dark-purple" />
                    </div>
                    <div className="font-medium">Ethereum</div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="polygon"
                    id="polygon"
                    className="peer sr-only"
                    disabled={isLoading || authLoading}
                  />
                  <Label
                    htmlFor="polygon"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-electric-blue [&:has([data-state=checked])]:bg-electric-blue/10"
                  >
                    <div className="mb-2 rounded-md bg-neutral-gray p-2">
                      <Wallet className="h-6 w-6 text-dark-purple" />
                    </div>
                    <div className="font-medium">Polygon</div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="binance"
                    id="binance"
                    className="peer sr-only"
                    disabled={isLoading || authLoading}
                  />
                  <Label
                    htmlFor="binance"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-electric-blue [&:has([data-state=checked])]:bg-electric-blue/10"
                  >
                    <div className="mb-2 rounded-md bg-neutral-gray p-2">
                      <Wallet className="h-6 w-6 text-dark-purple" />
                    </div>
                    <div className="font-medium">Binance</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-neutral-gray p-4">
              <div className="mb-2 text-sm font-medium text-medium-gray">Carteira Conectada</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-lime-green/20 p-1">
                    <Check className="h-4 w-4 text-lime-green" />
                  </div>
                  <div className="font-medium">{walletType.charAt(0).toUpperCase() + walletType.slice(1)}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-coral-red hover:text-coral-red/90 hover:bg-coral-red/10"
                  onClick={handleDisconnectWallet}
                  disabled={isLoading || authLoading}
                >
                  Desconectar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="walletAddress">Endereço da Carteira</Label>
              <div className="flex">
                <Input
                  id="walletAddress"
                  value={walletAddress}
                  readOnly
                  className="flex-1 rounded-r-none font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-l-none"
                  onClick={copyToClipboard}
                  disabled={isLoading || authLoading}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copiar endereço</span>
                </Button>
              </div>
              <p className="text-xs text-medium-gray">
                Este é o endereço da sua carteira conectada. Ele será usado para receber fundos dos projetos.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!walletConnected && (
          <Button
            className="w-full bg-electric-blue hover:bg-electric-blue/90"
            onClick={handleConnectWallet}
            disabled={isLoading || authLoading}
          >
            {(isLoading || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Conectar Carteira
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
