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

// HAITAI 일자별재고 원본 행
export interface ExcelRow {
  'SAP Code': string
  'Item Name': string
  'Type': string
  'Stock': string | number
  'UPC'?: string | number
  'Expire Date'?: string | number
  'Hold'?: string | number
  '재고상태'?: string
  'Box#'?: string | number
}

export interface RowError {
  rowIndex: number
  field: string
  message: string
}

export interface ValidationReport {
  valid: import('@/lib/excel-pipeline').ValidatedRow[]
  errors: RowError[]
}
