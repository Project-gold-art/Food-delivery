import { Package, ShoppingCart, Map, TrendingUp, Clock, ExternalLink, FolderTree, PlusCircle } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getProducts, getOrders, getDeliveryFees, getCategories, getComplements } from "@/lib/data"
import { formatDate } from "@/lib/utils"

export default async function AdminDashboardPage() {
  const products = await getProducts()
  const orders = await getOrders()
  const deliveryFees = await getDeliveryFees()
  const categories = await getCategories()
  const complements = await getComplements()

  // Filtrar pedidos pendentes (mais recentes primeiro)
  const pendingOrders = orders
    .filter((order) => order.status === "Pendente" || order.status === "Em preparo")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Calcular o valor total dos pedidos
  const totalRevenue = orders.reduce((total, order) => {
    const orderTotal =
      order.items.reduce((sum, item) => {
        const complementsTotal = item.selectedComplements?.reduce((sum, complement) => sum + complement.price, 0) || 0
        return sum + (item.price + complementsTotal) * item.quantity
      }, 0) + order.deliveryFee
    return total + orderTotal
  }, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Painel de Controle</h1>
          <p className="text-gray-500">Gerencie seu estabelecimento</p>
        </div>
        <Link href="/" target="_blank">
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Ver Menu do Cliente
          </Button>
        </Link>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-gray-500">Total de produtos cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <FolderTree className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-gray-500">Total de categorias cadastradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Complementos</CardTitle>
            <PlusCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complements.length}</div>
            <p className="text-xs text-gray-500">Total de complementos cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">Valor total dos pedidos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pedidos Recentes</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <div className="font-medium">Pedido #{order.id}</div>
                      <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                      <div className="text-sm">{order.customer.name}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge className={order.status === "Pendente" ? "bg-orange-500" : "bg-blue-500"}>
                        {order.status}
                      </Badge>
                      <div className="font-medium mt-1">
                        R${" "}
                        {(
                          order.items.reduce((sum, item) => {
                            const complementsTotal =
                              item.selectedComplements?.reduce((sum, complement) => sum + complement.price, 0) || 0
                            return sum + (item.price + complementsTotal) * item.quantity
                          }, 0) + order.deliveryFee
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link href="/admin/orders">
                    <Button variant="outline" size="sm">
                      Ver todos os pedidos
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">Nenhum pedido pendente no momento</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/products">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Gerenciar Produtos
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button className="w-full justify-start" variant="outline">
                  <FolderTree className="mr-2 h-4 w-4" />
                  Gerenciar Categorias
                </Button>
              </Link>
              <Link href="/admin/complements">
                <Button className="w-full justify-start" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Gerenciar Complementos
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Gerenciar Pedidos
                </Button>
              </Link>
              <Link href="/admin/delivery-fees">
                <Button className="w-full justify-start" variant="outline">
                  <Map className="mr-2 h-4 w-4" />
                  Taxas de Entrega
                </Button>
              </Link>
              <Link href="/" target="_blank">
                <Button className="w-full justify-start" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver Menu do Cliente
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Produtos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Adicione, edite ou remova produtos do seu cardápio. Atualize preços e descrições.
            </p>
            <Link href="/admin/products">
              <Button className="w-full">Acessar Produtos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Organize seus produtos em categorias para facilitar a navegação dos clientes.
            </p>
            <Link href="/admin/categories">
              <Button className="w-full">Acessar Categorias</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Complementos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Adicione complementos opcionais aos seus produtos para aumentar o valor médio dos pedidos.
            </p>
            <Link href="/admin/complements">
              <Button className="w-full">Acessar Complementos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxas de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Configure taxas de entrega por bairro. Adicione novos bairros ou atualize valores.
            </p>
            <Link href="/admin/delivery-fees">
              <Button className="w-full">Configurar Taxas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
