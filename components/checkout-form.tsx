"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { placeOrder } from "@/lib/actions"
import { getDeliveryFees } from "@/lib/data"
import type { DeliveryFee } from "@/lib/types"

export default function CheckoutForm({ subtotal }: { subtotal: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("Dinheiro")
  const [deliveryFees, setDeliveryFees] = useState<DeliveryFee[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("")
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [total, setTotal] = useState(subtotal)

  useEffect(() => {
    const fetchDeliveryFees = async () => {
      const fees = await getDeliveryFees()
      setDeliveryFees(fees)
      if (fees.length > 0) {
        setSelectedNeighborhood(fees[0].neighborhood)
        setDeliveryFee(fees[0].fee)
      }
    }

    fetchDeliveryFees()
  }, [])

  useEffect(() => {
    setTotal(subtotal + deliveryFee)
  }, [subtotal, deliveryFee])

  const handleNeighborhoodChange = (value: string) => {
    setSelectedNeighborhood(value)
    const fee = deliveryFees.find((fee) => fee.neighborhood === value)?.fee || 0
    setDeliveryFee(fee)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const customerData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: {
        street: formData.get("street") as string,
        number: formData.get("number") as string,
        neighborhood: selectedNeighborhood,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
      },
    }

    await placeOrder(customerData, paymentMethod, deliveryFee)
    router.push("/order-success")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Informações de Entrega</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Rua</Label>
            <Input id="street" name="street" required />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" name="number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Select value={selectedNeighborhood} onValueChange={handleNeighborhoodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o bairro" />
                </SelectTrigger>
                <SelectContent>
                  {deliveryFees.map((fee) => (
                    <SelectItem key={fee.id} value={fee.neighborhood}>
                      {fee.neighborhood} - Taxa: R$ {fee.fee.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" required defaultValue="São Paulo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input id="state" name="state" required defaultValue="SP" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea id="notes" name="notes" placeholder="Instruções especiais para entrega, referências, etc." />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Taxa de entrega ({selectedNeighborhood}):</span>
          <span>R$ {deliveryFee.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-2 font-bold flex justify-between">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Método de Pagamento</h2>

        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Dinheiro" id="payment-cash" />
            <Label htmlFor="payment-cash">Dinheiro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Cartão de Crédito" id="payment-credit" />
            <Label htmlFor="payment-credit">Cartão de Crédito (na entrega)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Cartão de Débito" id="payment-debit" />
            <Label htmlFor="payment-debit">Cartão de Débito (na entrega)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Pix" id="payment-pix" />
            <Label htmlFor="payment-pix">Pix</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={loading}>
        {loading ? "Processando..." : "Finalizar Pedido"}
      </Button>
    </form>
  )
}
