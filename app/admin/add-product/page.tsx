import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AddProductForm from "@/components/add-product-form"

export default function AddProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/admin" className="flex items-center text-rose-600 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o painel
        </Link>
        <h1 className="text-3xl font-bold">Adicionar Novo Produto</h1>
      </header>

      <div className="max-w-2xl mx-auto">
        <AddProductForm />
      </div>
    </div>
  )
}
