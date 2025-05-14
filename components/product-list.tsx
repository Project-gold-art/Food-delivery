"use client"

import Image from "next/image"
import { useState } from "react"
import { Plus, Info, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { addToCart } from "@/lib/actions"
import type { Product, Complement } from "@/lib/types"

export default function ProductList({ products }: { products: Product[] }) {
  const [adding, setAdding] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [complementsDialogOpen, setComplementsDialogOpen] = useState(false)
  const [selectedComplements, setSelectedComplements] = useState<Complement[]>([])

  const handleAddToCart = async (product: Product) => {
    // Se o produto tem complementos, abrir o diálogo
    if (product.complements && product.complements.length > 0) {
      setSelectedProduct(product)
      setSelectedComplements([])
      setComplementsDialogOpen(true)
      return
    }

    // Se não tem complementos, adicionar diretamente
    setAdding(product.id)
    await addToCart(product.id)
    setAdding(null)
  }

  const handleComplementToggle = (complement: Complement) => {
    setSelectedComplements((prev) => {
      const exists = prev.some((c) => c.id === complement.id)
      if (exists) {
        return prev.filter((c) => c.id !== complement.id)
      } else {
        return [...prev, complement]
      }
    })
  }

  const handleConfirmComplements = async () => {
    if (!selectedProduct) return

    setAdding(selectedProduct.id)
    await addToCart(selectedProduct.id, selectedComplements)
    setAdding(null)
    setComplementsDialogOpen(false)
    setSelectedProduct(null)
  }

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product)
  }

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0

    const complementsTotal = selectedComplements.reduce((sum, complement) => sum + complement.price, 0)
    return selectedProduct.price + complementsTotal
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">Nenhum produto encontrado nesta categoria.</div>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={product.image || "/placeholder.svg?height=192&width=384"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                <p className="font-bold text-rose-600">R$ {product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button
                  className="flex-1 mr-2 bg-rose-600 hover:bg-rose-700"
                  onClick={() => handleAddToCart(product)}
                  disabled={adding === product.id}
                >
                  {adding === product.id ? (
                    "Adicionando..."
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={() => openProductDetails(product)}>
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Detalhes</span>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Diálogo de detalhes do produto */}
      {selectedProduct && !complementsDialogOpen && (
        <Dialog
          open={!!selectedProduct && !complementsDialogOpen}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>{selectedProduct.description}</DialogDescription>
            </DialogHeader>

            <div className="relative h-48 w-full mb-4">
              <Image
                src={selectedProduct.image || "/placeholder.svg?height=192&width=384"}
                alt={selectedProduct.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Ingredientes:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedProduct.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <p className="font-bold text-lg text-rose-600">R$ {selectedProduct.price.toFixed(2)}</p>
              <Button onClick={() => handleAddToCart(selectedProduct)} className="bg-rose-600 hover:bg-rose-700">
                <Plus className="h-4 w-4 mr-2" /> Adicionar ao Carrinho
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de complementos */}
      {selectedProduct && (
        <Dialog open={complementsDialogOpen} onOpenChange={setComplementsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Deseja adicionar algum complemento?</DialogTitle>
              <DialogDescription>Escolha os complementos para {selectedProduct.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {selectedProduct.complements && selectedProduct.complements.length > 0 ? (
                selectedProduct.complements.map((complement) => (
                  <div key={complement.id} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`complement-${complement.id}`}
                        checked={selectedComplements.some((c) => c.id === complement.id)}
                        onCheckedChange={() => handleComplementToggle(complement)}
                      />
                      <Label htmlFor={`complement-${complement.id}`} className="cursor-pointer">
                        {complement.name}
                      </Label>
                    </div>
                    <span className="text-rose-600 font-medium">+ R$ {complement.price.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p>Este produto não possui complementos disponíveis.</p>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg text-rose-600">R$ {calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setComplementsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-rose-600 hover:bg-rose-700"
                onClick={handleConfirmComplements}
                disabled={adding === selectedProduct.id}
              >
                {adding === selectedProduct.id ? (
                  "Adicionando..."
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" /> Confirmar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
