"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { updateProduct } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { getCategories } from "@/lib/data"
import type { Product, Category } from "@/lib/types"

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(product.image || null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(product.categoryId || "")
  const [ingredients, setIngredients] = useState<string[]>(product.ingredients || [])
  const [newIngredient, setNewIngredient] = useState<string>("")
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(product.price)

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    }

    loadCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "") {
      setIngredients([...ingredients, newIngredient.trim()])
      setNewIngredient("")
    }
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const productData = {
      name,
      description,
      price,
      image: imagePreview,
      ingredients: ingredients.length > 0 ? ingredients : undefined,
      categoryId: selectedCategory || undefined,
    }

    await updateProduct(product.id, productData)

    toast({
      title: "Produto atualizado",
      description: "O produto foi atualizado com sucesso.",
    })

    router.push("/admin/products")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image">Imagem do Produto</Label>
        <div className="flex items-center gap-4">
          <div className="relative h-32 w-32 border rounded-lg overflow-hidden">
            {imagePreview ? (
              <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-100">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome do Produto</Label>
        <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Ingredientes</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar ingrediente"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={handleAddIngredient} disabled={!newIngredient.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {ingredients.map((ingredient, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {ingredient}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remover</span>
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Atualizar Produto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
