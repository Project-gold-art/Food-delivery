"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { deleteComplement, updateComplement } from "@/lib/actions"
import type { Complement, Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function ComplementsList({
  complements,
  products,
}: {
  complements: Complement[]
  products: Product[]
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [complementToDelete, setComplementToDelete] = useState<string | null>(null)
  const [editingComplement, setEditingComplement] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState(0)
  const [editProductId, setEditProductId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeleteClick = (complementId: string) => {
    setComplementToDelete(complementId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (complementToDelete) {
      setIsSubmitting(true)
      await deleteComplement(complementToDelete)
      setDeleteDialogOpen(false)
      setComplementToDelete(null)
      setIsSubmitting(false)

      toast({
        title: "Complemento excluído",
        description: "O complemento foi excluído com sucesso.",
      })

      router.refresh()
    }
  }

  const handleEditClick = (complement: Complement) => {
    setEditingComplement(complement.id)
    setEditName(complement.name)
    setEditPrice(complement.price)
    setEditProductId(complement.productId || "")
  }

  const handleSaveEdit = async (complementId: string) => {
    setIsSubmitting(true)
    await updateComplement(complementId, {
      name: editName,
      price: editPrice,
      productId: editProductId || undefined,
    })
    setEditingComplement(null)
    setIsSubmitting(false)

    toast({
      title: "Complemento atualizado",
      description: "O complemento foi atualizado com sucesso.",
    })

    router.refresh()
  }

  const getProductName = (productId?: string) => {
    if (!productId) return "-"
    const product = products.find((p) => p.id === productId)
    return product ? product.name : "-"
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhum complemento cadastrado
                </TableCell>
              </TableRow>
            ) : (
              complements.map((complement) => (
                <TableRow key={complement.id}>
                  <TableCell className="font-medium">
                    {editingComplement === complement.id ? (
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full" />
                    ) : (
                      complement.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingComplement === complement.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full"
                      />
                    ) : (
                      `R$ ${complement.price.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingComplement === complement.id ? (
                      <Select value={editProductId} onValueChange={setEditProductId}>
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
                    ) : (
                      getProductName(complement.productId)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingComplement === complement.id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveEdit(complement.id)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Salvando..." : "Salvar"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingComplement(null)}
                            disabled={isSubmitting}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(complement)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(complement.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este complemento? Esta ação não pode ser desfeita.
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
