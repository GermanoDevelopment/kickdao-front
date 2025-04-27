"use client"

import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectFilterProps {
  defaultValue?: string
}

export function ProjectFilter({ defaultValue = "24h" }: ProjectFilterProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-medium-gray">Período:</span>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">24 horas</SelectItem>
          <SelectItem value="1w">1 semana</SelectItem>
          <SelectItem value="1m">1 mês</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
