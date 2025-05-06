"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload } from "lucide-react"

import { useContract } from "@/context/contract.context"
import { useProject } from "@/context/project.context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CreateProjectForm() {
  const router = useRouter()
  const { createProject: createProjectOnChain, connected } = useContract()
  const { createProject: createProjectInDB, uploadProjectImage, loading: projectLoading } = useProject()

  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    fundingGoal: "",
    executionTime: "",
    sharesAmount: "50000",
    coverImage: null as File | null,
    additionalImages: [] as File[],
    milestones: [
      { title: "", description: "", amount: "" },
      { title: "", description: "", amount: "" },
    ],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedMilestones = [...prev.milestones]
      updatedMilestones[index] = { ...updatedMilestones[index], [field]: value }
      return { ...prev, milestones: updatedMilestones }
    })
  }

  const handleAddMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { title: "", description: "", amount: "" }],
    }))
  }

  const handleRemoveMilestone = (index: number) => {
    if (formData.milestones.length <= 2) {
      toast({
        title: "Erro",
        description: "Você precisa ter pelo menos 2 marcos para o projeto.",
        variant: "destructive",
      })
      return
    }

    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, coverImage: e.target.files![0] }))
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newFiles].slice(0, 5),
      }))
    }
  }

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }))
  }

  const nextStep = () => {
    // Validação básica para o primeiro passo
    if (currentStep === 1) {
      if (!formData.name || !formData.category || !formData.description || !formData.fundingGoal) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        return
      }
    }

    // Validação básica para o segundo passo
    if (currentStep === 2) {
      if (!formData.executionTime || !formData.sharesAmount) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        return
      }

      // Validar se todos os marcos têm título e valor
      const invalidMilestones = formData.milestones.some((milestone) => !milestone.title || !milestone.amount)
      if (invalidMilestones) {
        toast({
          title: "Marcos incompletos",
          description: "Todos os marcos precisam ter pelo menos título e valor.",
          variant: "destructive",
        })
        return
      }
    }

    // Validação básica para o terceiro passo
    if (currentStep === 3) {
      if (!formData.coverImage) {
        toast({
          title: "Imagem de capa obrigatória",
          description: "Por favor, adicione uma imagem de capa para o projeto.",
          variant: "destructive",
        })
        return
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Fazer upload das imagens
      let coverImageUrl = ""
      const additionalImageUrls: string[] = []

      if (formData.coverImage) {
        // coverImageUrl = await uploadProjectImage(formData.coverImage)
      }

      for (const image of formData.additionalImages) {
        // const imageUrl = await uploadProjectImage(image)
        // additionalImageUrls.push(imageUrl)
      }

      // 2. Criar o projeto no blockchain (simulado para desenvolvimento)
      let projectId: number | null = null

      if (connected) {
        // Calcular o preço por ação
        const totalShares = Number.parseInt(formData.sharesAmount)
        const pricePerShare = Number.parseFloat(formData.fundingGoal) / totalShares

        // Criar um URI para o projeto (pode ser um JSON com metadados)
        const projectMetadata = {
          name: formData.name,
          description: formData.description,
          image: coverImageUrl,
          category: formData.category,
        }

        // Converter para string JSON
        const projectUri = JSON.stringify(projectMetadata)

        try {
          // Criar o projeto no blockchain
          projectId = await createProjectOnChain(projectUri, totalShares, pricePerShare)
        } catch (error) {
          console.error("Erro ao criar projeto no blockchain:", error)
          // Continuar mesmo sem criar no blockchain para desenvolvimento
          projectId = Math.floor(Math.random() * 1000) + 1 // ID simulado para desenvolvimento
        }
      } else {
        // ID simulado para desenvolvimento
        projectId = Math.floor(Math.random() * 1000) + 1
      }

      // 3. Criar o projeto no banco de dados
      const deadline = new Date()
      deadline.setMonth(deadline.getMonth() + Number.parseInt(formData.executionTime))

      const projectData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        coverImage: coverImageUrl,
        additionalImages: additionalImageUrls,
        funding: {
          current: 0,
          target: Number.parseFloat(formData.fundingGoal),
          percentageFunded: 0,
          pricePerShare: Number.parseFloat(formData.fundingGoal) / Number.parseInt(formData.sharesAmount),
          sharesRemaining: Number.parseInt(formData.sharesAmount),
          deadline: deadline,
        },
        milestones: formData.milestones.map((milestone) => ({
          title: milestone.title,
          description: milestone.description,
          amount: Number.parseFloat(milestone.amount) || 0,
          completed: false,
        })),
        refundPolicy:
          "Em caso de não atingimento da meta de financiamento até o prazo final, todos os apoiadores receberão o reembolso integral dos valores investidos. Se o projeto for financiado com sucesso mas falhar em entregar os resultados prometidos em até 12 meses, os apoiadores poderão solicitar reembolso parcial conforme termos do contrato inteligente.",
        onChainProjectId: projectId ? projectId.toString() : undefined,
      }

      const dbProjectId = await createProjectInDB(projectData)

      toast({
        title: "Projeto criado com sucesso!",
        description: "Seu projeto foi enviado para análise e será publicado em breve.",
      })

      // Redirecionar para a página de projetos
      router.push(`/projects/${dbProjectId}`)
    } catch (error) {
      console.error("Erro ao criar projeto:", error)
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar seu projeto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Projeto</CardTitle>
        <CardDescription>Preencha os detalhes do seu projeto para iniciar o crowdfunding</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={`step-${currentStep}`} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="step-1" disabled>
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger value="step-2" disabled>
              Metas e Financiamento
            </TabsTrigger>
            <TabsTrigger value="step-3" disabled>
              Imagens
            </TabsTrigger>
            <TabsTrigger value="step-4" disabled>
              Revisão
            </TabsTrigger>
          </TabsList>

          {/* Passo 1: Informações Básicas */}
          <TabsContent value="step-1" className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Projeto *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: EcoTech Solar Panels"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                disabled={isLoading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energia-renovavel">Energia Renovável</SelectItem>
                  <SelectItem value="sustentabilidade">Sustentabilidade</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="agricultura">Agricultura</SelectItem>
                  <SelectItem value="mobilidade">Mobilidade</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Projeto *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva seu projeto em detalhes..."
                rows={5}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-medium-gray">
                Descreva seu projeto, seus objetivos e como ele será implementado. Seja claro e detalhado.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundingGoal">Meta de Financiamento (R$) *</Label>
              <Input
                id="fundingGoal"
                name="fundingGoal"
                type="number"
                min="1000"
                step="1000"
                value={formData.fundingGoal}
                onChange={handleChange}
                placeholder="Ex: 100000"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-medium-gray">
                Valor mínimo: R$ 1.000,00. Defina um valor realista para seu projeto.
              </p>
            </div>
          </TabsContent>

          {/* Passo 2: Metas e Financiamento */}
          <TabsContent value="step-2" className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="executionTime">Tempo de Execução *</Label>
              <Select
                name="executionTime"
                value={formData.executionTime}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, executionTime: value }))}
                disabled={isLoading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tempo de execução" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses</SelectItem>
                  <SelectItem value="18">18 meses</SelectItem>
                  <SelectItem value="24">24 meses</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-medium-gray">Tempo estimado para concluir o projeto após o financiamento.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sharesAmount">Quantidade de Ações *</Label>
              <RadioGroup
                value={formData.sharesAmount}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, sharesAmount: value }))}
                className="flex flex-col space-y-1"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50000" id="shares-50k" />
                  <Label htmlFor="shares-50k" className="font-normal">
                    50.000 ações
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="100000" id="shares-100k" />
                  <Label htmlFor="shares-100k" className="font-normal">
                    100.000 ações
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="200000" id="shares-200k" />
                  <Label htmlFor="shares-200k" className="font-normal">
                    200.000 ações
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-medium-gray">
                Número total de ações que serão vendidas para financiar seu projeto.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Marcos do Projeto *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMilestone}
                  disabled={isLoading || formData.milestones.length >= 5}
                >
                  Adicionar Marco
                </Button>
              </div>
              <p className="text-xs text-medium-gray mb-4">
                Defina marcos para seu projeto e como o financiamento será utilizado em cada etapa.
              </p>

              {formData.milestones.map((milestone, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Marco {index + 1}</CardTitle>
                      {formData.milestones.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMilestone(index)}
                          disabled={isLoading}
                          className="text-coral-red hover:text-coral-red/90 hover:bg-coral-red/10 h-8 px-2"
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${index}-title`}>Título *</Label>
                      <Input
                        id={`milestone-${index}-title`}
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                        placeholder="Ex: Desenvolvimento de Protótipo"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${index}-description`}>Descrição</Label>
                      <Textarea
                        id={`milestone-${index}-description`}
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
                        placeholder="Descreva este marco..."
                        rows={2}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${index}-amount`}>Valor (R$) *</Label>
                      <Input
                        id={`milestone-${index}-amount`}
                        type="number"
                        min="0"
                        step="1000"
                        value={milestone.amount}
                        onChange={(e) => handleMilestoneChange(index, "amount", e.target.value)}
                        placeholder="Ex: 25000"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Passo 3: Imagens */}
          <TabsContent value="step-3" className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coverImage">Imagem de Capa *</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="coverImage"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-neutral-gray/50 hover:bg-neutral-gray"
                >
                  {formData.coverImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={URL.createObjectURL(formData.coverImage) || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">Clique para alterar</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-medium-gray" />
                      <p className="mb-2 text-sm text-medium-gray">
                        <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-medium-gray">PNG, JPG ou JPEG (máx. 5MB)</p>
                    </div>
                  )}
                  <input
                    id="coverImage"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleCoverImageChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
              <p className="text-xs text-medium-gray">
                Esta será a imagem principal do seu projeto, exibida nos cards e no topo da página de detalhes.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalImages">Imagens Adicionais (opcional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="additionalImages"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-neutral-gray/50 hover:bg-neutral-gray"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-medium-gray" />
                    <p className="text-sm text-medium-gray">
                      <span className="font-semibold">Adicionar mais imagens</span>
                    </p>
                    <p className="text-xs text-medium-gray">Máximo de 5 imagens adicionais</p>
                  </div>
                  <input
                    id="additionalImages"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    multiple
                    className="hidden"
                    onChange={handleAdditionalImagesChange}
                    disabled={isLoading || formData.additionalImages.length >= 5}
                  />
                </label>
              </div>

              {formData.additionalImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.additionalImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Additional image ${index + 1}`}
                        className="h-32 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalImage(index)}
                        className="absolute top-2 right-2 bg-coral-red text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Passo 4: Revisão */}
          <TabsContent value="step-4" className="mt-6 space-y-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-dark-purple mb-2">Informações Básicas</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Nome do Projeto:</span>
                      <p className="text-medium-gray">{formData.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Categoria:</span>
                      <p className="text-medium-gray">{formData.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Meta de Financiamento:</span>
                      <p className="text-medium-gray">R$ {Number(formData.fundingGoal).toLocaleString("pt-BR")}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Tempo de Execução:</span>
                      <p className="text-medium-gray">{formData.executionTime} meses</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Quantidade de Ações:</span>
                      <p className="text-medium-gray">{Number(formData.sharesAmount).toLocaleString("pt-BR")} ações</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-dark-purple mb-2">Descrição</h3>
                  <p className="text-medium-gray whitespace-pre-line">{formData.description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-dark-purple mb-2">Marcos do Projeto</h3>
                <div className="space-y-3">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{milestone.title}</div>
                        <div className="text-medium-gray">R$ {Number(milestone.amount).toLocaleString("pt-BR")}</div>
                      </div>
                      {milestone.description && (
                        <p className="text-sm text-medium-gray mt-1">{milestone.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-dark-purple mb-2">Imagens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.coverImage && (
                    <div>
                      <span className="text-sm font-medium">Imagem de Capa:</span>
                      <img
                        src={URL.createObjectURL(formData.coverImage) || "/placeholder.svg"}
                        alt="Cover preview"
                        className="mt-1 w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {formData.additionalImages.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Imagens Adicionais:</span>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {formData.additionalImages.map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`Additional image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-neutral-gray/50 p-4 rounded-lg">
                <p className="text-sm text-medium-gray">
                  Ao criar este projeto, você concorda com os termos e condições da Kick DAO. Seu projeto passará por
                  uma análise antes de ser publicado na plataforma.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        {currentStep > 1 ? (
          <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
            Voltar
          </Button>
        ) : (
          <div></div>
        )}
        {currentStep < 4 ? (
          <Button
            type="button"
            className="bg-electric-blue hover:bg-electric-blue/90"
            onClick={nextStep}
            disabled={isLoading}
          >
            Próximo
          </Button>
        ) : (
          <Button
            type="button"
            className="bg-electric-blue hover:bg-electric-blue/90"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Projeto
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
