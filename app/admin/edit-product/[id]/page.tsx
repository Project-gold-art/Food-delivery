import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import EditProductForm from "@/components/edit-product-form"
import { getProductById } from "@/lib/data"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/admin/products" className="flex items-center text-rose-600 mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para produtos
        </Link>
        <h1 className="text-3xl font-bold">Editar Produto</h1>
      </header>

      <div className="max-w-2xl mx-auto">
        <EditProductForm product={product} />
      </div>
    </div>
  )
}
