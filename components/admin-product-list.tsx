"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deleteProduct, updateProduct } from "@/lib/actions"
import { getCategories } from "@/lib/data"
import type { Product, Category } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminProductList({ products }: { products: Product[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<number>(0)
  const [editCategory, setEditCategory] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    }

    loadCategories()
  }, [])

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (productToDelete) {
      setIsSubmitting(true)
      await deleteProduct(productToDelete)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      setIsSubmitting(false)

      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      })

      router.refresh()
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product.id)
    setEditPrice(product.price)
    setEditCategory(product.categoryId || "")
  }

  const handleSaveEdit = async (productId: string) => {
    setIsSubmitting(true)
    await updateProduct(productId, {
      price: editPrice,
      categoryId: editCategory || undefined,
    })
    setEditingProduct(null)
    setIsSubmitting(false)

    toast({
      title: "Produto atualizado",
      description: "O produto foi atualizado com sucesso.",
    })

    router.refresh()
  }

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "-"
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "-"
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Produtos</h2>
        <div className="flex gap-2">
          <Link href="/admin/categories">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Gerenciar Categorias
            </Button>
          </Link>
          <Link href="/admin/add-product">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Adicionar Produto
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ingredientes</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-10 w-10">
                    <Image
                      src={product.image || "/placeholder.svg?height=40&width=40"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <Select value={editCategory} onValueChange={setEditCategory}>
                      <SelectTrigger className="w-full">
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
                  ) : (
                    getCategoryName(product.categoryId)
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.ingredients && product.ingredients.length > 0 ? (
                      product.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {editingProduct === product.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-24 ml-auto"
                    />
                  ) : (
                    `R$ ${product.price.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {editingProduct === product.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveEdit(product.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Salvando..." : "Salvar"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProduct(null)}
                          disabled={isSubmitting}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href={`/admin/edit-product/${product.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(product.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
