'use client'
import { useRef, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { PinkButton } from '@/components/ui/PinkButton'

type Status = 'idle' | 'loading' | 'done' | 'error'

interface ResultFiles {
  orderList: string // base64
  kgl: string       // base64
}

const FILE_LABELS = [
  { key: 'sungwoo_to_ht', label: 'SungwooToHT',      hint: '오더 수량 원천 파일 (No. / Quantity 컬럼)' },
  { key: 'from_sungwoo',  label: 'FromSungwoo',       hint: '정렬 기준 템플릿 (Item No. 컬럼)' },
  { key: 'kgl_format',    label: 'KGL 출고 오더 포맷', hint: '최종 출력 파일 (SAP Code / 입출고수량 컬럼)' },
]

function downloadBase64(b64: string, filename: string) {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function KglOrderExporter() {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<ResultFiles | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleExport = async () => {
    const files = refs.map(r => r.current?.files?.[0])
    if (files.some(f => !f)) {
      setErrorMsg('파일 3개를 모두 선택해 주세요.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg(null)
    setResult(null)

    const fd = new FormData()
    files.forEach(f => fd.append('files', f!))

    const res = await fetch('/api/orders/kgl-export', { method: 'POST', body: fd })
    const json = await res.json().catch(() => ({ error: '서버 오류' }))

    if (!res.ok) {
      setErrorMsg(json.error ?? '알 수 없는 오류')
      setStatus('error')
      return
    }

    setResult(json as ResultFiles)
    setStatus('done')
  }

  return (
    <GlassCard>
      <h2 className="mb-1 text-lg font-semibold text-text-main">KGL 출고 오더 자동 변환</h2>
      <p className="mb-4 text-sm text-text-sub">
        3개 파일을 업로드하면 순서에 무관하게 자동 분류 후 수량을 매핑합니다.
      </p>

      <div className="space-y-4">
        {FILE_LABELS.map((item, i) => (
          <div key={item.key}>
            <p className="mb-1 text-xs font-medium text-text-main">{i + 1}. {item.label}</p>
            <p className="mb-1 text-xs text-text-sub/70">{item.hint}</p>
            <input
              ref={refs[i]}
              type="file"
              accept=".xlsx,.xls"
              className="block w-full text-sm text-text-sub file:mr-4 file:min-h-[44px] file:rounded-xl file:border-0 file:bg-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-main hover:file:bg-accent/20"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <PinkButton onClick={handleExport} disabled={status === 'loading'}>
          {status === 'loading' ? '처리 중...' : '변환 시작'}
        </PinkButton>
      </div>

      {status === 'error' && errorMsg && (
        <p className="mt-4 text-sm font-medium text-red-600">{errorMsg}</p>
      )}

      {status === 'done' && result && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-green-700">✓ 변환 완료 — 파일을 다운로드하세요.</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadBase64(result.orderList, '정렬된_오더리스트.xlsx')}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-sub hover:border-primary hover:text-primary transition-all"
            >
              ↓ 2번 — 정렬된 오더 리스트
            </button>
            <button
              type="button"
              onClick={() => downloadBase64(result.kgl, 'KGL_출고오더_완성.xlsx')}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-sub hover:border-primary hover:text-primary transition-all"
            >
              ↓ 3번 — KGL 출고 오더 완성
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
