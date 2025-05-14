"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addComplement } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function AddComplementForm({ products }: { products: Product[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [productId, setProductId] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    await addComplement({
      name,
      price: Number(price),
      productId: productId || undefined,
    })

    toast({
      title: "Complemento adicionado",
      description: "O complemento foi adicionado com sucesso.",
    })

    setName("")
    setPrice("")
    setProductId("")
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Complemento</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product">Produto (opcional)</Label>
        <Select value={productId} onValueChange={setProductId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Se não selecionar um produto, o complemento estará disponível para todos os produtos.
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Adicionando..." : "Adicionar Complemento"}
      </Button>
    </form>
  )
}
