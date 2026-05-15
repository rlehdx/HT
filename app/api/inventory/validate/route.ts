// PATH: app/api/inventory/validate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { parseExcelBuffer, validateRows } from '@/lib/excel-pipeline'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = await file.arrayBuffer()
  const parsed = parseExcelBuffer(buffer)

  if ('headerError' in parsed) {
    return NextResponse.json({ error: parsed.headerError }, { status: 422 })
  }

  const report = validateRows(parsed)
  return NextResponse.json(report, { status: 200 })
}
