"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateCartItemQuantity, removeFromCart } from "@/lib/actions"
import type { CartItem } from "@/lib/types"

export default function CartItems({ items }: { items: CartItem[] }) {
  // Função para calcular o preço total de um item com complementos
  const calculateItemTotal = (item: CartItem) => {
    const complementsTotal = item.selectedComplements?.reduce((sum, complement) => sum + complement.price, 0) || 0
    return (item.price + complementsTotal) * item.quantity
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex gap-4">
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg?height=80&width=80"}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>

              {/* Mostrar complementos selecionados */}
              {item.selectedComplements && item.selectedComplements.length > 0 && (
                <div className="mt-1 mb-2">
                  <p className="text-xs text-gray-500 mb-1">Complementos:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.selectedComplements.map((complement, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {complement.name} (+R$ {complement.price.toFixed(2)})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                <div className="font-bold">
                  R$ {calculateItemTotal(item).toFixed(2)}
                  {item.selectedComplements && item.selectedComplements.length > 0 && (
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      (R${" "}
                      {(item.price + (item.selectedComplements?.reduce((sum, c) => sum + c.price, 0) || 0)).toFixed(2)}{" "}
                      cada)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Diminuir</span>
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Aumentar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
