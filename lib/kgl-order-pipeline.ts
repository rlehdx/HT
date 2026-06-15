/**
 * KGL 출고 오더 자동화 파이프라인 (TypeScript / xlsx 기반)
 *
 * classify  → load order qty (SungwooToHT)
 *           → load sort order (FromSungwoo)
 *           → write qty to KGL format
 *           → return ArrayBuffer
 */
import * as XLSX from 'xlsx'

// ─── 파일 자동 분류 ──────────────────────────────────────────────────────────

type FileType = 'sungwoo_to_ht' | 'from_sungwoo' | 'kgl_format'

const SIGNATURES: Record<FileType, string[]> = {
  sungwoo_to_ht: ['No.', 'Quantity', 'Each Price'],
  from_sungwoo:  ['Item No.', 'Available Qty.', 'Each Price 1'],
  kgl_format:    ['SAP Code', '입출고수량'],
}

function findHeaderRow(sheet: XLSX.WorkSheet, hints: string[], maxScan = 20): number {
  const range = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1')
  const end = Math.min(range.e.r, maxScan)
  for (let r = range.s.r; r <= end; r++) {
    const cells = new Set<string>()
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })]
      if (cell) cells.add(String(cell.v).trim())
    }
    if (hints.every(h => cells.has(h))) return r
  }
  return -1
}

function classifyBuffer(buf: ArrayBuffer, filename: string): FileType {
  const name = filename.toLowerCase().replace(/[\s_-]/g, '')
  if (name.includes('sunwooToHT'.toLowerCase()) || name.includes('sungwooToHT'.toLowerCase())) return 'sungwoo_to_ht'
  if (name.includes('fromsungwoo')) return 'from_sungwoo'
  if (name.includes('kgl') || name.includes('inventory')) return 'kgl_format'

  const wb = XLSX.read(buf, { type: 'array', sheetRows: 25 })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  for (const [type, hints] of Object.entries(SIGNATURES) as [FileType, string[]][]) {
    if (findHeaderRow(sheet, hints) >= 0) return type
  }
  throw new Error(`파일 유형을 자동으로 분류할 수 없습니다: ${filename}`)
}

// ─── 코드 정규화 ─────────────────────────────────────────────────────────────

function normalizeCode(raw: unknown): string {
  let s = String(raw ?? '').trim().toUpperCase()
  if (s.startsWith('H')) s = s.slice(1)
  if (s.includes('.')) {
    const n = parseFloat(s)
    if (!isNaN(n)) s = String(Math.round(n))
  }
  return s
}

// ─── Step 2: SungwooToHT → {코드: 합산수량} ─────────────────────────────────

function loadOrderQty(buf: ArrayBuffer): Map<string, number> {
  const wb = XLSX.read(buf, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const hr = findHeaderRow(sheet, SIGNATURES.sungwoo_to_ht)
  if (hr < 0) throw new Error('SungwooToHT: 헤더 행을 찾을 수 없습니다.')

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: true,
    range: hr,
  })

  const map = new Map<string, number>()
  for (const row of rows) {
    const key = normalizeCode(row['No.'])
    if (!key) continue
    const qty = parseFloat(String(row['Quantity'] ?? '0')) || 0
    map.set(key, (map.get(key) ?? 0) + qty)
  }
  return map
}

// ─── Step 3: FromSungwoo → 정렬 기준 키 배열 ─────────────────────────────────

function loadSortOrder(buf: ArrayBuffer): string[] {
  const wb = XLSX.read(buf, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const hr = findHeaderRow(sheet, SIGNATURES.from_sungwoo)
  if (hr < 0) throw new Error('FromSungwoo: 헤더 행을 찾을 수 없습니다.')

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: true,
    range: hr,
  })

  return rows
    .map(r => normalizeCode(r['Item No.']))
    .filter(Boolean)
}

// ─── Step 4~5: KGL 포맷에 수량 기록 ─────────────────────────────────────────

export function processOrderFiles(files: { name: string; buffer: ArrayBuffer }[]): ArrayBuffer {
  // 자동 분류
  const classified = new Map<FileType, ArrayBuffer>()
  for (const f of files) {
    const type = classifyBuffer(f.buffer, f.name)
    if (classified.has(type)) throw new Error(`동일 유형(${type})의 파일이 2개 이상 업로드되었습니다.`)
    classified.set(type, f.buffer)
  }

  const missing = (['sungwoo_to_ht', 'from_sungwoo', 'kgl_format'] as FileType[]).filter(t => !classified.has(t))
  if (missing.length) throw new Error(`다음 유형의 파일이 누락되었습니다: ${missing.join(', ')}`)

  const orderQty = loadOrderQty(classified.get('sungwoo_to_ht')!)
  const sortOrder = loadSortOrder(classified.get('from_sungwoo')!)

  // FromSungwoo 순서 기반 정렬 맵
  const sortedQty = new Map<string, number>()
  for (const code of sortOrder) {
    if (orderQty.has(code)) sortedQty.set(code, orderQty.get(code)!)
  }
  orderQty.forEach((qty, code) => {
    if (!sortedQty.has(code)) sortedQty.set(code, qty)
  })

  // KGL 파일 수정
  const kglBuf = classified.get('kgl_format')!
  const wb = XLSX.read(kglBuf, { type: 'array', cellStyles: true })
  const sheet = wb.Sheets[wb.SheetNames[0]]

  const hr = findHeaderRow(sheet, ['SAP Code'])
  if (hr < 0) throw new Error("KGL 파일에서 'SAP Code' 헤더를 찾을 수 없습니다.")

  const range = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1')

  // 헤더 행에서 SAP Code · 입출고수량 열 인덱스 탐색
  let sapCol = -1, qtyCol = -1
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r: hr, c })]
    if (!cell) continue
    const v = String(cell.v).trim()
    if (v === 'SAP Code') sapCol = c
    if (v === '입출고수량') qtyCol = c
  }
  if (sapCol < 0) throw new Error("KGL 파일에서 'SAP Code' 열을 찾을 수 없습니다.")
  if (qtyCol < 0) throw new Error("KGL 파일에서 '입출고수량' 열을 찾을 수 없습니다.")

  // 동일 SAP Code 첫 번째 행에만 수량 기록
  const written = new Set<string>()
  for (let r = hr + 1; r <= range.e.r; r++) {
    const sapCell = sheet[XLSX.utils.encode_cell({ r, c: sapCol })]
    if (!sapCell) continue
    const norm = normalizeCode(sapCell.v)
    if (sortedQty.has(norm) && !written.has(norm)) {
      const addr = XLSX.utils.encode_cell({ r, c: qtyCol })
      sheet[addr] = { t: 'n', v: sortedQty.get(norm)! }
      written.add(norm)
    }
  }

  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
}
