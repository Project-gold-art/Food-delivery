import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ComplementsList from "@/components/complements-list"
import AddComplementForm from "@/components/add-complement-form"
import { getComplements, getProducts } from "@/lib/data"

export default async function ComplementsPage() {
  const complements = await getComplements()
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/admin/dashboard" className="flex items-center text-rose-600 mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Painel de Controle
        </Link>
        <h1 className="text-3xl font-bold">Gerenciar Complementos</h1>
        <p className="text-gray-500">Adicione, edite ou remova complementos para os produtos</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Complementos Cadastrados</h2>
          <ComplementsList complements={complements} products={products} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Adicionar Novo Complemento</h2>
          <AddComplementForm products={products} />
        </div>
      </div>
    </div>
  )
}
