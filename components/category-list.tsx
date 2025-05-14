"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { deleteCategory, updateCategory } from "@/lib/actions"
import type { Category } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function CategoryList({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (categoryToDelete) {
      setIsSubmitting(true)
      setError(null)

      try {
        await deleteCategory(categoryToDelete)
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)

        toast({
          title: "Categoria excluída",
          description: "A categoria foi excluída com sucesso.",
        })
      } catch (err: any) {
        setError(err.message || "Não foi possível excluir a categoria")
      } finally {
        setIsSubmitting(false)
      }

      router.refresh()
    }
  }

  const handleEditClick = (category: Category) => {
    setEditingCategory(category.id)
    setEditName(category.name)
    setEditDescription(category.description || "")
  }

  const handleSaveEdit = async (categoryId: string) => {
    setIsSubmitting(true)

    await updateCategory(categoryId, {
      name: editName,
      description: editDescription || undefined,
    })

    setEditingCategory(null)
    setIsSubmitting(false)

    toast({
      title: "Categoria atualizada",
      description: "A categoria foi atualizada com sucesso.",
    })

    router.refresh()
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Nenhuma categoria cadastrada
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {editingCategory === category.id ? (
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full" />
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCategory === category.id ? (
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full"
                        rows={2}
                      />
                    ) : (
                      category.description || "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingCategory === category.id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveEdit(category.id)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Salvando..." : "Salvar"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCategory(null)}
                            disabled={isSubmitting}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category.id)}>
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
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
              {error && <div className="mt-2 text-red-500 text-sm font-medium">{error}</div>}
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
