import type { Metadata } from "next"
import CreateProjectClientPage from "./CreateProjectClientPage"

export const metadata: Metadata = {
  title: "Criar Projeto | Kick DAO",
  description: "Crie um novo projeto na Kick DAO",
}

export default function CreateProjectPage() {
  return <CreateProjectClientPage />
}
