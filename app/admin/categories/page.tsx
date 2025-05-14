import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import CategoryList from "@/components/category-list"
import AddCategoryForm from "@/components/add-category-form"
import { getCategories } from "@/lib/data"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/admin/dashboard" className="flex items-center text-rose-600 mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Painel de Controle
        </Link>
        <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
        <p className="text-gray-500">Adicione, edite ou remova categorias de produtos</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Categorias Cadastradas</h2>
          <CategoryList categories={categories} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Adicionar Nova Categoria</h2>
          <AddCategoryForm />
        </div>
      </div>
    </div>
  )
}
