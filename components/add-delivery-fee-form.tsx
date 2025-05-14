"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addDeliveryFee } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function AddDeliveryFeeForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [neighborhood, setNeighborhood] = useState("")
  const [fee, setFee] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    await addDeliveryFee({
      neighborhood,
      fee: Number(fee),
    })

    toast({
      title: "Taxa adicionada",
      description: "A taxa de entrega foi adicionada com sucesso.",
    })

    setNeighborhood("")
    setFee("")
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6">
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Nome do Bairro</Label>
        <Input id="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fee">Taxa de Entrega (R$)</Label>
        <Input
          id="fee"
          type="number"
          step="0.01"
          min="0"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Adicionando..." : "Adicionar Taxa"}
      </Button>
    </form>
  )
}
