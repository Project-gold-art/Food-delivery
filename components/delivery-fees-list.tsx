"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { deleteDeliveryFee, updateDeliveryFee } from "@/lib/actions"
import type { DeliveryFee } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function DeliveryFeesList({ deliveryFees }: { deliveryFees: DeliveryFee[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [feeToDelete, setFeeToDelete] = useState<string | null>(null)
  const [editingFee, setEditingFee] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeleteClick = (feeId: string) => {
    setFeeToDelete(feeId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (feeToDelete) {
      setIsSubmitting(true)
      await deleteDeliveryFee(feeToDelete)
      setDeleteDialogOpen(false)
      setFeeToDelete(null)
      setIsSubmitting(false)

      toast({
        title: "Taxa excluída",
        description: "A taxa de entrega foi excluída com sucesso.",
      })

      router.refresh()
    }
  }

  const handleEditClick = (fee: DeliveryFee) => {
    setEditingFee(fee.id)
    setEditValue(fee.fee)
  }

  const handleSaveEdit = async (feeId: string) => {
    setIsSubmitting(true)
    await updateDeliveryFee(feeId, editValue)
    setEditingFee(null)
    setIsSubmitting(false)

    toast({
      title: "Taxa atualizada",
      description: "O valor da taxa de entrega foi atualizado com sucesso.",
    })

    router.refresh()
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bairro</TableHead>
              <TableHead className="text-right">Taxa (R$)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveryFees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Nenhuma taxa de entrega cadastrada
                </TableCell>
              </TableRow>
            ) : (
              deliveryFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.neighborhood}</TableCell>
                  <TableCell className="text-right">
                    {editingFee === fee.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-24 ml-auto"
                      />
                    ) : (
                      `R$ ${fee.fee.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingFee === fee.id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveEdit(fee.id)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Salvando..." : "Salvar"}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingFee(null)} disabled={isSubmitting}>
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(fee)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(fee.id)}>
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
              Tem certeza que deseja excluir esta taxa de entrega? Esta ação não pode ser desfeita.
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
