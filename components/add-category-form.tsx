"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addCategory } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function AddCategoryForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    await addCategory({
      name,
      description: description || undefined,
    })

    toast({
      title: "Categoria adicionada",
      description: "A categoria foi adicionada com sucesso.",
    })

    setName("")
    setDescription("")
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Categoria</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva brevemente esta categoria"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Adicionando..." : "Adicionar Categoria"}
      </Button>
    </form>
  )
}
