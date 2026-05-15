// PATH: lib/excel-pipeline.ts
import * as XLSX from 'xlsx'
import { z } from 'zod'
import type { ExcelRow, RowError, ValidationReport } from '@/lib/types'

const REQUIRED_HEADERS = ['SKU', 'ProductName', 'Category', 'Price', 'Stock', 'Unit', 'Description', 'ImageURL']

const ExcelRowSchema = z.object({
  SKU:         z.string().min(1, 'SKU is required'),
  ProductName: z.string().min(1, 'ProductName is required'),
  Category:    z.string().min(1, 'Category is required'),
  Price:       z.string().or(z.number()).transform((val) => {
    const cleaned = String(val).replace(/[^0-9.]/g, '')
    const num = parseFloat(cleaned)
    if (isNaN(num)) throw new Error('Invalid price format')
    return num
  }),
  Stock:       z.string().or(z.number()).transform((val) => {
    const num = parseInt(String(val), 10)
    if (isNaN(num)) throw new Error('Invalid stock format')
    return num
  }),
  Unit:        z.string().min(1, 'Unit is required'),
  Description: z.string(),
  ImageURL:    z.string(),
})

export type ValidatedRow = z.infer<typeof ExcelRowSchema>

export function parseExcelBuffer(buffer: ArrayBuffer): ExcelRow[] | { headerError: string } {
  const workbook = XLSX.read(buffer, { type: 'array', cellFormula: false })
  const sheetName = workbook.SheetNames.includes('Products')
    ? 'Products'
    : workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false,
  })

  if (raw.length === 0) {
    return { headerError: `Missing or empty sheet. Expected headers: ${REQUIRED_HEADERS.join(', ')}` }
  }

  const firstRowKeys = Object.keys(raw[0])
  const missingHeaders = REQUIRED_HEADERS.filter(h => !firstRowKeys.includes(h))
  if (missingHeaders.length > 0) {
    return { headerError: `Missing required columns: ${missingHeaders.join(', ')}` }
  }

  return raw as unknown as ExcelRow[]
}

export function validateRows(rows: ExcelRow[]): ValidationReport {
  const valid: ValidatedRow[] = []
  const errors: RowError[] = []
  const seenSkus = new Map<string, number>()

  rows.forEach((row, index) => {
    const rowIndex = index + 2

    const result = ExcelRowSchema.safeParse(row)
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push({
          rowIndex,
          field: String(issue.path[0] ?? 'unknown'),
          message: issue.message,
        })
      })
      return
    }

    const existingIndex = seenSkus.get(result.data.SKU)
    if (existingIndex !== undefined) {
      valid.splice(existingIndex, 1, result.data)
      seenSkus.set(result.data.SKU, existingIndex)
    } else {
      seenSkus.set(result.data.SKU, valid.length)
      valid.push(result.data)
    }
  })

  return { valid, errors }
}
