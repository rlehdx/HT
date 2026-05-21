// PATH: lib/excel-pipeline.ts
import * as XLSX from 'xlsx'
import type { RowError, ValidationReport } from '@/lib/types'

// HAITAI 일자별재고 형식 컬럼명
const REQUIRED_HEADERS = ['SAP Code', 'Item Name', 'Type', 'Stock']

export interface ValidatedRow {
  SKU: string
  ProductName: string
  Category: string
  Price: number
  Stock: number
  Unit: string
  Description: string
  ImageURL: string
}

export interface ParsedSheet {
  rows: Record<string, unknown>[]
  sheetName: string
  date: string | null
}

// 시트명에서 날짜 추출 (HT-2026.05.01 → 2026-05-01)
function extractDateFromSheet(name: string): string | null {
  const m = name.match(/(\d{4})\.(\d{2})\.(\d{2})/)
  if (m) return `${m[1]}-${m[2]}-${m[3]}`
  return null
}

// 실제 데이터 헤더 행 찾기 (SAP Code가 있는 행)
function findHeaderRow(sheet: XLSX.WorkSheet): number {
  const range = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1')
  for (let r = range.s.r; r <= Math.min(range.e.r, 15); r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })]
      if (cell && String(cell.v).trim() === 'SAP Code') return r
    }
  }
  return -1
}

export function parseExcelBuffer(buffer: ArrayBuffer): ParsedSheet | { headerError: string } {
  const workbook = XLSX.read(buffer, { type: 'array', cellFormula: false })

  // 가장 최신 시트(마지막) 사용
  const sheetName = workbook.SheetNames[workbook.SheetNames.length - 1]
  const sheet = workbook.Sheets[sheetName]
  const date = extractDateFromSheet(sheetName)

  const headerRow = findHeaderRow(sheet)
  if (headerRow < 0) {
    return {
      headerError: `헤더 행을 찾을 수 없습니다. "SAP Code" 컬럼이 있는지 확인하세요. (시트: ${sheetName})`,
    }
  }

  const raw = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    defval: '',
    raw: false,
    header: 1,
  })

  // 헤더 행 이후부터 데이터 파싱
  const headers = raw[headerRow] as string[]
  const dataRows: Record<string, unknown>[] = []
  for (let i = headerRow + 1; i < raw.length; i++) {
    const row = raw[i] as unknown[]
    if (!row || row.every(v => v === '' || v === null || v === undefined)) continue
    const obj: Record<string, unknown> = {}
    headers.forEach((h, ci) => { if (h) obj[String(h).trim()] = row[ci] ?? '' })
    dataRows.push(obj)
  }

  if (dataRows.length === 0) {
    return { headerError: `데이터 행이 없습니다. (시트: ${sheetName})` }
  }

  const firstKeys = Object.keys(dataRows[0])
  const missing = REQUIRED_HEADERS.filter(h => !firstKeys.includes(h))
  if (missing.length > 0) {
    return { headerError: `필수 컬럼 누락: ${missing.join(', ')} (시트: ${sheetName})` }
  }

  return { rows: dataRows, sheetName, date }
}

export function validateRows(parsed: ParsedSheet): ValidationReport {
  const valid: ValidatedRow[] = []
  const errors: RowError[] = []
  const seenSkus = new Map<string, number>()

  parsed.rows.forEach((row, index) => {
    const rowIndex = index + 2

    const sku = String(row['SAP Code'] ?? '').trim()
    const name = String(row['Item Name'] ?? '').trim()
    const category = String(row['Type'] ?? '').trim()
    const stockRaw = row['Stock']
    const stock = parseInt(String(stockRaw ?? '0').replace(/[^0-9]/g, ''), 10)

    if (!sku) {
      errors.push({ rowIndex, field: 'SAP Code', message: 'SAP Code가 비어있습니다' })
      return
    }
    if (!name) {
      errors.push({ rowIndex, field: 'Item Name', message: '제품명이 비어있습니다' })
      return
    }
    if (!category) {
      errors.push({ rowIndex, field: 'Type', message: '카테고리가 비어있습니다' })
      return
    }

    const validRow: ValidatedRow = {
      SKU: sku,
      ProductName: name,
      Category: category,
      Price: 0,
      Stock: isNaN(stock) ? 0 : stock,
      Unit: 'EA',
      Description: '',
      ImageURL: '',
    }

    const existingIndex = seenSkus.get(sku)
    if (existingIndex !== undefined) {
      valid[existingIndex] = validRow
    } else {
      seenSkus.set(sku, valid.length)
      valid.push(validRow)
    }
  })

  return { valid, errors }
}
