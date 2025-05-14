"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

import { getProductById, getCartItems, getCategoryById } from "./data"
import type { Product, Customer, DeliveryFee, Category, Complement, CartItem } from "./types"
import { cookies } from "next/headers"

// Simulação de banco de dados em memória (referenciando os mesmos objetos do data.ts)
// Em um aplicativo real, isso seria um banco de dados
let products: Product[] = []
let cart: CartItem[] = []
let orders: any[] = []
let deliveryFees: DeliveryFee[] = []
let categories: Category[] = []
let complements: Complement[] = []

// Simulação de banco de dados para usuários administradores
const adminUsers = [
  {
    id: "1",
    username: "admin",
    // Em um sistema real, isso seria um hash da senha
    password: "admin123",
  },
]

// Simulação de sessões ativas
const activeSessions: Record<string, { userId: string; username: string; expiresAt: Date }> = {}

// Inicialização dos dados
async function initData() {
  // Não precisamos mais inicializar os dados aqui, pois eles já são carregados
  // e persistidos no módulo data.ts
  products = await import("./data").then((module) => module.getProducts())
  cart = await import("./data").then((module) => module.getCartItems())
  orders = await import("./data").then((module) => module.getOrders())
  deliveryFees = await import("./data").then((module) => module.getDeliveryFees())
  categories = await import("./data").then((module) => module.getCategories())
  complements = await import("./data").then((module) => module.getComplements())
}

// Ações do carrinho
export async function addToCart(productId: string, selectedComplements?: Complement[]) {
  await initData()

  const product = await getProductById(productId)
  if (!product) return

  // Verificar se já existe um item idêntico no carrinho (mesmo produto e mesmos complementos)
  const existingItemIndex = cart.findIndex((item) => {
    if (item.id !== productId) return false

    // Se não tem complementos selecionados em ambos, são iguais
    if (!selectedComplements?.length && !item.selectedComplements?.length) return true

    // Se um tem complementos e o outro não, são diferentes
    if (
      (!selectedComplements?.length && item.selectedComplements?.length) ||
      (selectedComplements?.length && !item.selectedComplements?.length)
    )
      return false

    // Verificar se os complementos são os mesmos
    if (selectedComplements?.length !== item.selectedComplements?.length) return false

    // Verificar se todos os complementos são iguais
    return selectedComplements.every((sc) => item.selectedComplements?.some((ic) => ic.id === sc.id))
  })

  if (existingItemIndex !== -1) {
    // Se encontrou um item idêntico, apenas incrementa a quantidade
    cart[existingItemIndex].quantity += 1
  } else {
    // Caso contrário, adiciona um novo item
    cart.push({
      ...product,
      quantity: 1,
      selectedComplements,
    })
  }

  // Persistir a alteração
  const { updateCart } = await import("./data")
  updateCart(cart)

  revalidatePath("/cart")
  revalidatePath("/")
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  await initData()

  const item = cart.find((item) => item.id === itemId)
  if (item) {
    item.quantity = quantity

    // Persistir a alteração
    const { updateCart } = await import("./data")
    updateCart(cart)
  }

  revalidatePath("/cart")
}

export async function removeFromCart(itemId: string) {
  await initData()

  const index = cart.findIndex((item) => item.id === itemId)
  if (index !== -1) {
    cart.splice(index, 1)

    // Persistir a alteração
    const { updateCart } = await import("./data")
    updateCart(cart)
  }

  revalidatePath("/cart")
}

// Ações de pedidos
export async function placeOrder(customer: Customer, paymentMethod: string, deliveryFee: number) {
  await initData()

  const items = await getCartItems()
  if (items.length === 0) return

  const newOrder = {
    id: (orders.length + 1001).toString(),
    date: new Date(),
    customer,
    items: [...items],
    status: "Pendente",
    paymentMethod,
    deliveryFee,
  }

  orders.push(newOrder)

  // Persistir a alteração
  const { updateOrders, updateCart } = await import("./data")
  updateOrders(orders)

  // Limpar o carrinho após finalizar o pedido
  cart.length = 0
  updateCart(cart)

  revalidatePath("/admin")
  revalidatePath("/admin/orders")
  revalidatePath("/admin/dashboard")
  revalidatePath("/cart")
}

// Ações de produtos
export async function addProduct(productData: Omit<Product, "id">) {
  await initData()

  // Verificar se a categoria existe
  if (productData.categoryId) {
    const category = await getCategoryById(productData.categoryId)
    if (!category) {
      throw new Error("Categoria não encontrada")
    }
  }

  const newProduct = {
    id: uuidv4(),
    ...productData,
  }

  products.push(newProduct)

  // Persistir a alteração
  const { updateProducts } = await import("./data")
  updateProducts(products)

  revalidatePath("/admin")
  revalidatePath("/admin/products")
  revalidatePath("/admin/dashboard")
  revalidatePath("/")
}

export async function updateProduct(productId: string, productData: Partial<Product>) {
  await initData()

  const product = products.find((p) => p.id === productId)
  if (product) {
    // Verificar se a categoria existe se estiver sendo atualizada
    if (productData.categoryId) {
      const category = await getCategoryById(productData.categoryId)
      if (!category) {
        throw new Error("Categoria não encontrada")
      }
    }

    Object.assign(product, productData)

    // Persistir a alteração
    const { updateProducts } = await import("./data")
    updateProducts(products)
  }

  revalidatePath("/admin")
  revalidatePath("/admin/products")
  revalidatePath("/admin/dashboard")
  revalidatePath("/")
}

export async function deleteProduct(productId: string) {
  await initData()

  const index = products.findIndex((product) => product.id === productId)
  if (index !== -1) {
    products.splice(index, 1)

    // Persistir a alteração
    const { updateProducts } = await import("./data")
    updateProducts(products)
  }

  // Remover o produto do carrinho também
  const cartIndex = cart.findIndex((item) => item.id === productId)
  if (cartIndex !== -1) {
    cart.splice(cartIndex, 1)

    // Persistir a alteração do carrinho
    const { updateCart } = await import("./data")
    updateCart(cart)
  }

  // Remover os complementos associados a este produto
  complements = complements.filter((c) => c.productId !== productId)
  const { updateComplements } = await import("./data")
  updateComplements(complements)

  revalidatePath("/admin")
  revalidatePath("/admin/products")
  revalidatePath("/admin/dashboard")
  revalidatePath("/")
  revalidatePath("/cart")
}

// Ações de complementos
export async function addComplement(complementData: Omit<Complement, "id">) {
  await initData()

  // Verificar se o produto existe
  if (complementData.productId) {
    const product = await getProductById(complementData.productId)
    if (!product) {
      throw new Error("Produto não encontrado")
    }
  }

  const newComplement = {
    id: uuidv4(),
    ...complementData,
  }

  complements.push(newComplement)

  // Atualizar os complementos no produto
  if (complementData.productId) {
    const product = products.find((p) => p.id === complementData.productId)
    if (product) {
      product.complements = product.complements || []
      product.complements.push(newComplement)

      const { updateProducts } = await import("./data")
      updateProducts(products)
    }
  }

  // Persistir a alteração
  const { updateComplements } = await import("./data")
  updateComplements(complements)

  revalidatePath("/admin")
  revalidatePath("/admin/products")
  revalidatePath("/admin/complements")
  revalidatePath("/")
}

export async function updateComplement(complementId: string, complementData: Partial<Complement>) {
  await initData()

  const complement = complements.find((c) => c.id === complementId)
  if (complement) {
    // Verificar se o produto existe se estiver sendo atualizado
    if (complementData.productId && complementData.productId !== complement.productId) {
      const product = await getProductById(complementData.productId)
      if (!product) {
        throw new Error("Produto não encontrado")
      }
    }

    // Salvar o productId antigo para atualizar os produtos
    const oldProductId = complement.productId

    Object.assign(complement, complementData)

    // Atualizar os complementos nos produtos
    if (oldProductId) {
      const oldProduct = products.find((p) => p.id === oldProductId)
      if (oldProduct && oldProduct.complements) {
        oldProduct.complements = oldProduct.complements.filter((c) => c.id !== complementId)
      }
    }

    if (complement.productId) {
      const newProduct = products.find((p) => p.id === complement.productId)
      if (newProduct) {
        newProduct.complements = newProduct.complements || []
        if (!newProduct.complements.some((c) => c.id === complementId)) {
          newProduct.complements.push(complement)
        } else {
          const index = newProduct.complements.findIndex((c) => c.id === complementId)
          if (index !== -1) {
            newProduct.complements[index] = complement
          }
        }
      }
    }

    // Persistir as alterações
    const { updateComplements, updateProducts } = await import("./data")
    updateComplements(complements)
    updateProducts(products)
  }

  revalidatePath("/admin")
  revalidatePath("/admin/products")
  revalidatePath("/admin/complements")
  revalidatePath("/")
}

export async function deleteComplement(complementId: string) {
  await initData()

  const complement = complements.find((c) => c.id === complementId)
  if (!complement) return

  // Remover o complemento do produto
  if (complement.productId) {
    const product = products.find((p) => p.id === complement.productId)
    if (product && product.complements) {
      product.complements = product.complements.filter((c) => c.id !== complementId)

      const { updateProducts } = await import("./data")
      updateProducts(products)
    }
  }

  // Remover o complemento da lista
  const index = complements.findIndex((complement) => complement.id === complementId)
  if (index !== -1) {
    complements.splice(index, 1)

    // Persistir a alteração
    const { updateComplements } = await import("./data")
    updateComplements(complements)
  }

  revalidatePath("/admin")
  revalidatePath("/admin/products")
  revalidatePath("/admin/complements")
  revalidatePath("/")
}

// Ações de categorias
export async function addCategory(categoryData: Omit<Category, "id">) {
  await initData()

  const newCategory = {
    id: uuidv4(),
    ...categoryData,
  }

  categories.push(newCategory)

  // Persistir a alteração
  const { updateCategories } = await import("./data")
  updateCategories(categories)

  revalidatePath("/admin")
  revalidatePath("/admin/categories")
  revalidatePath("/admin/products")
  revalidatePath("/")
}

export async function updateCategory(categoryId: string, categoryData: Partial<Category>) {
  await initData()

  const category = categories.find((c) => c.id === categoryId)
  if (category) {
    Object.assign(category, categoryData)

    // Persistir a alteração
    const { updateCategories } = await import("./data")
    updateCategories(categories)
  }

  revalidatePath("/admin")
  revalidatePath("/admin/categories")
  revalidatePath("/admin/products")
  revalidatePath("/")
}

export async function deleteCategory(categoryId: string) {
  await initData()

  // Verificar se existem produtos nesta categoria
  const productsInCategory = products.filter((product) => product.categoryId === categoryId)

  if (productsInCategory.length > 0) {
    throw new Error("Não é possível excluir uma categoria que contém produtos")
  }

  const index = categories.findIndex((category) => category.id === categoryId)
  if (index !== -1) {
    categories.splice(index, 1)

    // Persistir a alteração
    const { updateCategories } = await import("./data")
    updateCategories(categories)
  }

  revalidatePath("/admin")
  revalidatePath("/admin/categories")
  revalidatePath("/admin/products")
  revalidatePath("/")
}

// Ações de taxas de entrega
export async function addDeliveryFee(feeData: Omit<DeliveryFee, "id">) {
  await initData()

  const newFee = {
    id: uuidv4(),
    ...feeData,
  }

  deliveryFees.push(newFee)

  // Persistir a alteração
  const { updateDeliveryFees } = await import("./data")
  updateDeliveryFees(deliveryFees)

  revalidatePath("/admin/delivery-fees")
  revalidatePath("/admin/dashboard")
  revalidatePath("/cart")
}

export async function updateDeliveryFee(feeId: string, fee: number) {
  await initData()

  const deliveryFee = deliveryFees.find((f) => f.id === feeId)
  if (deliveryFee) {
    deliveryFee.fee = fee

    // Persistir a alteração
    const { updateDeliveryFees } = await import("./data")
    updateDeliveryFees(deliveryFees)
  }

  revalidatePath("/admin/delivery-fees")
  revalidatePath("/admin/dashboard")
  revalidatePath("/cart")
}

export async function deleteDeliveryFee(feeId: string) {
  await initData()

  const index = deliveryFees.findIndex((fee) => fee.id === feeId)
  if (index !== -1) {
    deliveryFees.splice(index, 1)

    // Persistir a alteração
    const { updateDeliveryFees } = await import("./data")
    updateDeliveryFees(deliveryFees)
  }

  revalidatePath("/admin/delivery-fees")
  revalidatePath("/admin/dashboard")
  revalidatePath("/cart")
}

// Ações de pedidos para administradores
export async function updateOrderStatus(orderId: string, status: string) {
  await initData()

  const order = orders.find((o) => o.id === orderId)
  if (order) {
    order.status = status

    // Persistir a alteração
    const { updateOrders } = await import("./data")
    updateOrders(orders)
  }

  revalidatePath("/admin/orders")
  revalidatePath("/admin/dashboard")
  revalidatePath(`/admin/orders/${orderId}`)
}

// Função para autenticar um administrador
export async function loginAdmin(username: string, password: string): Promise<boolean> {
  await initData()

  const user = adminUsers.find((u) => u.username === username && u.password === password)

  if (!user) {
    return false
  }

  // Criar uma sessão
  const sessionId = uuidv4()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 1) // Expira em 1 dia

  activeSessions[sessionId] = {
    userId: user.id,
    username: user.username,
    expiresAt,
  }

  // Salvar o cookie de sessão
  cookies().set("admin_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })

  return true
}

// Função para fazer logout
export async function logoutAdmin() {
  const sessionId = cookies().get("admin_session")?.value

  if (sessionId) {
    delete activeSessions[sessionId]
    cookies().delete("admin_session")
  }

  return { success: true }
}
