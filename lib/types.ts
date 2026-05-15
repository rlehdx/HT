// PATH: lib/types.ts
export type UserRole = 'b2b' | 'b2c'

export type OrderStatus =
  | 'pending_payment'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
  description: string | null
  image_url: string | null
  version: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  type: UserRole
  total_amount: number
  shipping_name: string
  shipping_address: string
  shipping_phone: string
  business_number: string | null
  company_name: string | null
  tax_invoice_email: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
}

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export interface ExcelRow {
  SKU: string
  ProductName: string
  Category: string
  Price: string | number
  Stock: string | number
  Unit: string
  Description: string
  ImageURL: string
}

export interface RowError {
  rowIndex: number
  field: string
  message: string
}

export interface ValidationReport {
  valid: ExcelRow[]
  errors: RowError[]
}
