import type { Product, CartItem, Order, DeliveryFee, Category, Complement } from "./types"

// Simulação de banco de dados em memória com persistência
let categories: Category[] = [
  {
    id: "1",
    name: "Hambúrgueres",
    description: "Deliciosos hambúrgueres artesanais",
  },
  {
    id: "2",
    name: "Pizzas",
    description: "Pizzas com massa fresca e ingredientes selecionados",
  },
  {
    id: "3",
    name: "Bebidas",
    description: "Refrigerantes, sucos e outras bebidas",
  },
  {
    id: "4",
    name: "Porções",
    description: "Porções para compartilhar",
  },
  {
    id: "5",
    name: "Sobremesas",
    description: "Doces e sobremesas",
  },
]

let complements: Complement[] = [
  {
    id: "1",
    name: "Hambúrguer extra",
    price: 8.5,
    productId: "1",
  },
  {
    id: "2",
    name: "Queijo cheddar extra",
    price: 3.5,
    productId: "1",
  },
  {
    id: "3",
    name: "Bacon extra",
    price: 4.0,
    productId: "1",
  },
  {
    id: "4",
    name: "Borda recheada",
    price: 7.9,
    productId: "2",
  },
  {
    id: "5",
    name: "Molho extra",
    price: 2.5,
    productId: "2",
  },
  {
    id: "6",
    name: "Batata frita pequena",
    price: 8.9,
    productId: "1",
  },
  {
    id: "7",
    name: "Refrigerante lata",
    price: 5.9,
    productId: "1",
  },
]

let products: Product[] = [
  {
    id: "1",
    name: "X-Burger Especial",
    description: "Hambúrguer artesanal com queijo, bacon, alface e tomate",
    price: 25.9,
    image: "/placeholder.svg?height=200&width=200&text=X-Burger",
    ingredients: ["Pão brioche", "Hambúrguer 180g", "Queijo cheddar", "Bacon", "Alface", "Tomate", "Molho especial"],
    categoryId: "1",
    complements: complements.filter((c) => c.productId === "1"),
  },
  {
    id: "2",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela, manjericão fresco e azeite",
    price: 45.9,
    image: "/placeholder.svg?height=200&width=200&text=Pizza",
    ingredients: ["Massa fresca", "Molho de tomate", "Mussarela", "Manjericão", "Azeite extra virgem"],
    categoryId: "2",
    complements: complements.filter((c) => c.productId === "2"),
  },
  {
    id: "3",
    name: "Porção de Batata Frita",
    description: "Batatas fritas crocantes com molho especial da casa",
    price: 18.9,
    image: "/placeholder.svg?height=200&width=200&text=Batata",
    ingredients: ["Batata", "Sal", "Molho especial"],
    categoryId: "4",
  },
  {
    id: "4",
    name: "Refrigerante 2L",
    description: "Coca-Cola, Guaraná ou Sprite",
    price: 12.9,
    image: "/placeholder.svg?height=200&width=200&text=Refri",
    ingredients: [],
    categoryId: "3",
  },
  {
    id: "5",
    name: "Açaí 500ml",
    description: "Açaí cremoso com granola, banana e leite condensado",
    price: 22.9,
    image: "/placeholder.svg?height=200&width=200&text=Açaí",
    ingredients: ["Açaí", "Granola", "Banana", "Leite condensado"],
    categoryId: "5",
  },
  {
    id: "6",
    name: "Salada Caesar",
    description: "Alface, croutons, frango grelhado e molho caesar",
    price: 28.9,
    image: "/placeholder.svg?height=200&width=200&text=Salada",
    ingredients: ["Alface", "Croutons", "Frango grelhado", "Molho caesar", "Queijo parmesão"],
    categoryId: "4",
  },
]

let cart: CartItem[] = []

let orders: Order[] = [
  {
    id: "1001",
    date: new Date("2025-05-08T18:30:00"),
    customer: {
      name: "João Silva",
      phone: "(11) 98765-4321",
      address: {
        street: "Rua das Flores",
        number: "123",
        neighborhood: "Jardim Primavera",
        city: "São Paulo",
        state: "SP",
      },
    },
    items: [
      {
        id: "1",
        name: "X-Burger Especial",
        description: "Hambúrguer artesanal com queijo, bacon, alface e tomate",
        price: 25.9,
        quantity: 2,
        image: "/placeholder.svg?height=200&width=200&text=X-Burger",
        ingredients: [
          "Pão brioche",
          "Hambúrguer 180g",
          "Queijo cheddar",
          "Bacon",
          "Alface",
          "Tomate",
          "Molho especial",
        ],
        categoryId: "1",
        selectedComplements: [
          {
            id: "2",
            name: "Queijo cheddar extra",
            price: 3.5,
          },
        ],
      },
      {
        id: "4",
        name: "Refrigerante 2L",
        description: "Coca-Cola, Guaraná ou Sprite",
        price: 12.9,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200&text=Refri",
        ingredients: [],
        categoryId: "3",
      },
    ],
    status: "Entregue",
    paymentMethod: "Cartão de Crédito",
    deliveryFee: 5.0,
  },
  {
    id: "1002",
    date: new Date("2025-05-09T12:45:00"),
    customer: {
      name: "Maria Oliveira",
      phone: "(11) 91234-5678",
      address: {
        street: "Avenida Paulista",
        number: "1500",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
      },
    },
    items: [
      {
        id: "2",
        name: "Pizza Margherita",
        description: "Molho de tomate, mussarela, manjericão fresco e azeite",
        price: 45.9,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200&text=Pizza",
        ingredients: ["Massa fresca", "Molho de tomate", "Mussarela", "Manjericão", "Azeite extra virgem"],
        categoryId: "2",
      },
    ],
    status: "Pendente",
    paymentMethod: "Dinheiro",
    deliveryFee: 8.0,
  },
]

let deliveryFees: DeliveryFee[] = [
  {
    id: "1",
    neighborhood: "Centro",
    fee: 5.0,
  },
  {
    id: "2",
    neighborhood: "Jardim Primavera",
    fee: 7.0,
  },
  {
    id: "3",
    neighborhood: "Bela Vista",
    fee: 8.0,
  },
]

// Tenta carregar dados do localStorage (se estiver no cliente)
if (typeof window !== "undefined") {
  try {
    const savedProducts = localStorage.getItem("products")
    const savedOrders = localStorage.getItem("orders")
    const savedDeliveryFees = localStorage.getItem("deliveryFees")
    const savedCart = localStorage.getItem("cart")
    const savedCategories = localStorage.getItem("categories")
    const savedComplements = localStorage.getItem("complements")

    if (savedProducts) products = JSON.parse(savedProducts)
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders)
      // Converte as strings de data de volta para objetos Date
      orders = parsedOrders.map((order: any) => ({
        ...order,
        date: new Date(order.date),
      }))
    }
    if (savedDeliveryFees) deliveryFees = JSON.parse(savedDeliveryFees)
    if (savedCart) cart = JSON.parse(savedCart)
    if (savedCategories) categories = JSON.parse(savedCategories)
    if (savedComplements) complements = JSON.parse(savedComplements)
  } catch (error) {
    console.error("Erro ao carregar dados do localStorage:", error)
  }
}

// Funções para acessar os dados
export async function getProducts(): Promise<Product[]> {
  return products
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return products.filter((product) => product.categoryId === categoryId)
}

export async function getCartItems(): Promise<CartItem[]> {
  return cart
}

export async function getOrders(): Promise<Order[]> {
  return orders
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  return orders.find((order) => order.id === id)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return products.find((product) => product.id === id)
}

export async function getDeliveryFees(): Promise<DeliveryFee[]> {
  return deliveryFees
}

export async function getDeliveryFeeById(id: string): Promise<DeliveryFee | undefined> {
  return deliveryFees.find((fee) => fee.id === id)
}

export async function getDeliveryFeeByNeighborhood(neighborhood: string): Promise<DeliveryFee | undefined> {
  return deliveryFees.find((fee) => fee.neighborhood === neighborhood)
}

export async function getCategories(): Promise<Category[]> {
  return categories
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  return categories.find((category) => category.id === id)
}

export async function getComplements(): Promise<Complement[]> {
  return complements
}

export async function getComplementsByProductId(productId: string): Promise<Complement[]> {
  return complements.filter((complement) => complement.productId === productId)
}

export async function getComplementById(id: string): Promise<Complement | undefined> {
  return complements.find((complement) => complement.id === id)
}

// Funções para modificar os dados
export function updateProducts(newProducts: Product[]): void {
  products = newProducts
  if (typeof window !== "undefined") {
    localStorage.setItem("products", JSON.stringify(products))
  }
}

export function updateOrders(newOrders: Order[]): void {
  orders = newOrders
  if (typeof window !== "undefined") {
    localStorage.setItem("orders", JSON.stringify(orders))
  }
}

export function updateDeliveryFees(newFees: DeliveryFee[]): void {
  deliveryFees = newFees
  if (typeof window !== "undefined") {
    localStorage.setItem("deliveryFees", JSON.stringify(deliveryFees))
  }
}

export function updateCart(newCart: CartItem[]): void {
  cart = newCart
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart))
  }
}

export function updateCategories(newCategories: Category[]): void {
  categories = newCategories
  if (typeof window !== "undefined") {
    localStorage.setItem("categories", JSON.stringify(categories))
  }
}

export function updateComplements(newComplements: Complement[]): void {
  complements = newComplements
  if (typeof window !== "undefined") {
    localStorage.setItem("complements", JSON.stringify(complements))
  }
}
