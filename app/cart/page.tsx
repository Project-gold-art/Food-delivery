import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import CartItems from "@/components/cart-items"
import CheckoutForm from "@/components/checkout-form"
import { getCartItems } from "@/lib/data"

export default async function CartPage() {
  const cartItems = await getCartItems()

  // Calcular o subtotal considerando os complementos
  const subtotal = cartItems.reduce((sum, item) => {
    const complementsTotal = item.selectedComplements?.reduce((sum, complement) => sum + complement.price, 0) || 0
    return sum + (item.price + complementsTotal) * item.quantity
  }, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/" className="flex items-center text-rose-600 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o cardápio
        </Link>
        <h1 className="text-3xl font-bold">Seu Carrinho</h1>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {cartItems.length > 0 ? (
            <CartItems items={cartItems} />
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <p className="mb-4">Seu carrinho está vazio</p>
              <Link href="/">
                <Button>Explorar Cardápio</Button>
              </Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div>
            <CheckoutForm subtotal={subtotal} />
          </div>
        )}
      </div>
    </div>
  )
}
