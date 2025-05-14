import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AdminOrderList from "@/components/admin-order-list"
import { getOrders } from "@/lib/data"

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/admin/dashboard" className="flex items-center text-rose-600 mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Painel de Controle
        </Link>
        <h1 className="text-3xl font-bold">Gerenciar Pedidos</h1>
        <p className="text-gray-500">Visualize e atualize o status dos pedidos</p>
      </header>

      <AdminOrderList orders={orders} />
    </div>
  )
}
