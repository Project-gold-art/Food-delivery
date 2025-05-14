"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductList from "@/components/product-list"
import { getProducts, getCategories, getProductsByCategory } from "@/lib/data"
import type { Product, Category } from "@/lib/types"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const categoriesData = await getCategories()
      setCategories(categoriesData)

      if (categoriesData.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesData[0].id)
        const categoryProducts = await getProductsByCategory(categoriesData[0].id)
        setProducts(categoryProducts)
      } else if (selectedCategory) {
        const categoryProducts = await getProductsByCategory(selectedCategory)
        setProducts(categoryProducts)
      } else {
        const allProducts = await getProducts()
        setProducts(allProducts)
      }
    }

    loadData()
  }, [selectedCategory])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-rose-600">FoodExpress</h1>
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Carrinho</span>
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="mb-12">
          <div className="bg-rose-50 rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-rose-700 mb-4">Bem-vindo ao FoodExpress!</h2>
            <p className="text-lg mb-6">Deliciosas opções de comida entregues na sua porta.</p>
            <Link href="#produtos">
              <Button className="bg-rose-600 hover:bg-rose-700">Ver Cardápio</Button>
            </Link>
          </div>
        </section>

        <section id="produtos" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Nosso Cardápio</h2>

          <Tabs defaultValue={categories[0]?.id} className="mb-8">
            <TabsList className="mb-6 flex flex-wrap">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className="px-4 py-2"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="mb-4">
                  <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                  {category.description && <p className="text-gray-500 mb-4">{category.description}</p>}
                </div>
                <ProductList products={products} />
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>

      <footer className="mt-12 pt-8 border-t">
        <p className="text-center text-gray-500">© 2025 FoodExpress. Todos os direitos reservados.</p>
        <p className="text-center text-gray-400 text-sm mt-2">
          <Link href="/admin/login" className="hover:underline">
            Acesso do Estabelecimento
          </Link>
        </p>
      </footer>
    </div>
  )
}
