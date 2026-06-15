import { NextRequest, NextResponse } from 'next/server'
import { processOrderFiles } from '@/lib/kgl-order-pipeline'

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
    const result = processOrderFiles(files)

    return new NextResponse(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="KGL_%EC%B6%9C%EA%B3%A0%EC%98%A4%EB%8D%94_%EC%99%84%EC%84%B1.xlsx"',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
