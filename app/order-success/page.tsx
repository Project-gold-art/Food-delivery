import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Pedido Realizado com Sucesso!</h1>
        <p className="text-gray-500 mb-8">
          Seu pedido foi recebido e está sendo processado. Você receberá atualizações sobre o status da entrega.
        </p>
        <div className="flex flex-col gap-4">
          <Link href="/">
            <Button className="w-full">Voltar para o Cardápio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
