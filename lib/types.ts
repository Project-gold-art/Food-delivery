export interface Complement {
  id: string
  name: string
  price: number
  productId?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  ingredients?: string[]
  categoryId?: string
  complements?: Complement[]
}

export interface Category {
  id: string
  name: string
  description?: string
}

export interface CartItem extends Product {
  quantity: number
  selectedComplements?: Complement[]
}

export interface CustomerAddress {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
}

export interface Customer {
  name: string
  phone: string
  address: CustomerAddress
}

export interface Order {
  id: string
  date: Date
  customer: Customer
  items: CartItem[]
  status: "Pendente" | "Em preparo" | "Saiu para entrega" | "Entregue"
  paymentMethod: string
  deliveryFee: number
}

export interface DeliveryFee {
  id: string
  neighborhood: string
  fee: number
}
