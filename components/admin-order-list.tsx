"use client"

import Link from "next/link"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Order } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function AdminOrderList({ orders }: { orders: Order[] }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Pedidos</h2>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>
                    R${" "}
                    {(
                      order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + order.deliveryFee
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={order.status === "Entregue" ? "bg-green-500" : "bg-orange-500"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver detalhes</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
