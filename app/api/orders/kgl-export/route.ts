import { NextRequest, NextResponse } from 'next/server'
import { processOrderFiles } from '@/lib/kgl-order-pipeline'

function toBase64(buf: ArrayBuffer): string {
  return Buffer.from(buf).toString('base64')
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const entries = formData.getAll('files') as File[]

  if (!entries || entries.length !== 3) {
    return NextResponse.json({ error: '파일 3개를 모두 업로드해 주세요.' }, { status: 400 })
  }

  try {
    const files = await Promise.all(
      entries.map(async (f) => ({ name: f.name, buffer: await f.arrayBuffer() }))
    )
    const { kglBuffer, orderListBuffer } = processOrderFiles(files)

    return NextResponse.json({
      kgl: toBase64(kglBuffer),
      orderList: toBase64(orderListBuffer),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
