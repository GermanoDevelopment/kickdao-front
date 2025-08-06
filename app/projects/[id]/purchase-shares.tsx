"use client"

import type React from "react"

import { useState } from "react"
import { Wallet, CreditCard, Loader2 } from "lucide-react"

import { useContract } from "@/context/contract.context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { KdaoTokenCheck } from "@/components/wallet/kdao-token-check"

interface PurchaseSharesProps {
  pricePerShare: number
  maxShares: number
  projectId: string
}

export default function PurchaseShares({ pricePerShare, maxShares, projectId }: PurchaseSharesProps) {
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { connected, hasKdaoToken, connectWallet, buyProjectShares } = useContract()
  const [showTokenCheck, setShowTokenCheck] = useState(false)

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value) || value < 1) {
      setQuantity(1)
    } else if (value > maxShares) {
      setQuantity(maxShares)
    } else {
      setQuantity(value)
    }
  }

  const handleCryptoPayment = async () => {
    if (!connected) {
      const success = await connectWallet()
      if (!success) return
    }

    if (!hasKdaoToken) {
      setShowTokenCheck(true)
      return
    }

    setIsSubmitting(true)
    try {
      // Compra ações usando o contrato
      const success = await buyProjectShares(Number.parseInt(projectId), quantity, pricePerShare)

      if (success) {
        toast({
          title: "Compra realizada com sucesso",
          description: `Você adquiriu ${quantity} ações deste projeto.`,
        })
      }
    } catch (error) {
      console.error("Erro na transação:", error)
      toast({
        title: "Erro na transação",
        description: "Ocorreu um erro ao processar sua transação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFiatPayment = async () => {
    setIsSubmitting(true)
    try {
      // Simulação de pagamento em fiat
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Pagamento processado",
        description: "Seu pagamento foi processado com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar seu pagamento.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showTokenCheck) {
    return (
      <div className="space-y-4">
        <KdaoTokenCheck onSuccess={() => setShowTokenCheck(false)} />
        <Button variant="outline" onClick={() => setShowTokenCheck(false)} className="w-full">
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade de ações</Label>
        <Input id="quantity" type="number" min={1} max={maxShares} value={quantity} onChange={handleQuantityChange} />
        <p className="text-sm text-muted-foreground">Total: {formatCurrency(quantity * pricePerShare)}</p>
      </div>

      <Tabs defaultValue="crypto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crypto">
            <Wallet className="h-4 w-4 mr-2" />
            Crypto
          </TabsTrigger>
          <TabsTrigger value="fiat">
            <CreditCard className="h-4 w-4 mr-2" />
            Fiat
          </TabsTrigger>
        </TabsList>
        <TabsContent value="crypto" className="space-y-4 pt-4">
          <p className="text-sm">
            Pague com sua carteira de criptomoedas preferida. Suportamos Ethereum, Polygon e outras redes.
          </p>
          <Button className="w-full" onClick={handleCryptoPayment} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : connected ? (
              "Comprar ações com crypto"
            ) : (
              "Conectar carteira e pagar"
            )}
          </Button>
        </TabsContent>
        <TabsContent value="fiat" className="space-y-4 pt-4">
          <p className="text-sm">
            Pague com cartão de crédito, débito ou PIX. Processamento seguro via gateway de pagamento.
          </p>
          <Button className="w-full" onClick={handleFiatPayment} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Prosseguir para pagamento"
            )}
          </Button>
        </TabsContent>
      </Tabs>

      {!hasKdaoToken && connected && (
        <div className="mt-4">
          <KdaoTokenCheck showCard={false} />
        </div>
      )}
    </div>
  )
}
