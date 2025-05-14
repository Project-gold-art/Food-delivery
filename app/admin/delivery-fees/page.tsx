import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import DeliveryFeesList from "@/components/delivery-fees-list"
import AddDeliveryFeeForm from "@/components/add-delivery-fee-form"
import { getDeliveryFees } from "@/lib/data"

export default async function DeliveryFeesPage() {
  const deliveryFees = await getDeliveryFees()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/admin/dashboard" className="flex items-center text-rose-600 mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Painel de Controle
        </Link>
        <h1 className="text-3xl font-bold">Taxas de Entrega</h1>
        <p className="text-gray-500">Gerencie as taxas de entrega por bairro</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Taxas Cadastradas</h2>
          <DeliveryFeesList deliveryFees={deliveryFees} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Adicionar Nova Taxa</h2>
          <AddDeliveryFeeForm />
        </div>
      </div>
    </div>
  )
}
