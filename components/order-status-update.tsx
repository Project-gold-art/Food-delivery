"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { updateOrderStatus } from "@/lib/actions"

type OrderStatus = "Pendente" | "Em preparo" | "Saiu para entrega" | "Entregue"

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const statuses: OrderStatus[] = ["Pendente", "Em preparo", "Saiu para entrega", "Entregue"]

  const handleUpdateStatus = async (status: OrderStatus) => {
    if (status === currentStatus) return

    setLoading(true)
    await updateOrderStatus(orderId, status)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {statuses.map((status) => (
        <Button
          key={status}
          variant={currentStatus === status ? "default" : "outline"}
          onClick={() => handleUpdateStatus(status)}
          disabled={loading}
        >
          {status}
        </Button>
      ))}
    </div>
  )
}
