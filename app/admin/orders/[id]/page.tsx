import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getOrderById } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import OrderStatusUpdate from "@/components/order-status-update"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id)

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Pedido não encontrado</h1>
        <Link href="/admin/orders">
          <Button>Voltar para pedidos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex flex-col space-y-2">
          <Link href="/admin/orders" className="flex items-center text-rose-600 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para pedidos
          </Link>
          <Link href="/admin/dashboard" className="flex items-center text-rose-600 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Painel de Controle
          </Link>
        </div>
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-3xl font-bold">Pedido #{order.id}</h1>
          <Badge className={order.status === "Entregue" ? "bg-green-500" : "bg-orange-500"}>{order.status}</Badge>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Data:</span>
                <span>{formatDate(order.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cliente:</span>
                <span>{order.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Telefone:</span>
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Método de Pagamento:</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {order.customer.address.street}, {order.customer.address.number}
            </p>
            <p>{order.customer.address.neighborhood}</p>
            <p>
              {order.customer.address.city}, {order.customer.address.state}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Produto</th>
                    <th className="px-4 py-2 text-center">Quantidade</th>
                    <th className="px-4 py-2 text-right">Preço</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">R$ {item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">R$ {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-medium">
                      Subtotal:
                    </td>
                    <td className="px-4 py-3 text-right">
                      R$ {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-medium">
                      Taxa de entrega:
                    </td>
                    <td className="px-4 py-3 text-right">R$ {order.deliveryFee.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={3} className="px-4 py-3 text-right">
                      Total:
                    </td>
                    <td className="px-4 py-3 text-right">
                      R${" "}
                      {(
                        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + order.deliveryFee
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Atualizar Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
