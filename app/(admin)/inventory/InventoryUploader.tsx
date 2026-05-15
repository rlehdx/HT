// PATH: app/(admin)/inventory/InventoryUploader.tsx
'use client'
import { useState, useRef } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { PinkButton } from '@/components/ui/PinkButton'
import type { ValidationReport, RowError } from '@/lib/types'

type Step = 'idle' | 'validating' | 'validated' | 'committing' | 'done' | 'error'

export function InventoryUploader() {
  const [step, setStep] = useState<Step>('idle')
  const [report, setReport] = useState<ValidationReport | null>(null)
  const [commitResult, setCommitResult] = useState<{ committed: number; errors: RowError[] } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const getFile = (): File | null => fileRef.current?.files?.[0] ?? null

  const handleValidate = async () => {
    const file = getFile()
    if (!file) return
    setStep('validating')
    setErrorMsg(null)

    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch('/api/inventory/validate', { method: 'POST', body: fd })
    const json = await res.json()

    if (!res.ok) {
      setErrorMsg(json.error)
      setStep('error')
      return
    }

    setReport(json as ValidationReport)
    setStep('validated')
  }

  const handleCommit = async () => {
    const file = getFile()
    if (!file) return
    setStep('committing')

    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch('/api/inventory/commit', { method: 'POST', body: fd })
    const json = await res.json()

    if (!res.ok) {
      setErrorMsg(json.error)
      setStep('error')
      return
    }

    setCommitResult(json)
    setStep('done')
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-text-main">Upload Excel File</h2>
        <p className="mb-4 text-sm text-text-sub">
          Required columns: SKU, ProductName, Category, Price, Stock, Unit, Description, ImageURL
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="block w-full text-sm text-text-sub file:mr-4 file:min-h-[44px] file:rounded-xl file:border-0 file:bg-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-main hover:file:bg-accent/20"
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <PinkButton onClick={handleValidate} disabled={step === 'validating' || step === 'committing'}>
            {step === 'validating' ? 'Validating...' : 'Validate (Dry Run)'}
          </PinkButton>
          {step === 'validated' && (
            <PinkButton onClick={handleCommit} disabled={!report || report.valid.length === 0}>
              Commit {report?.valid.length ?? 0} Valid Rows
            </PinkButton>
          )}
        </div>
      </GlassCard>

      {step === 'error' && errorMsg && (
        <GlassCard>
          <p className="text-sm font-medium text-red-700">{errorMsg}</p>
        </GlassCard>
      )}

      {report && (step === 'validated' || step === 'committing') && (
        <GlassCard>
          <h3 className="mb-3 font-semibold text-text-main">
            Validation Report — {report.valid.length} valid / {report.errors.length} errors
          </h3>
          {report.errors.length > 0 && (
            <ul className="space-y-1">
              {report.errors.map((e, i) => (
                <li key={i} className="text-xs text-red-600">
                  Row {e.rowIndex} · {e.field}: {e.message}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      )}

      {step === 'done' && commitResult && (
        <GlassCard>
          <p className="font-semibold text-green-700">
            ✓ {commitResult.committed} products upserted successfully.
          </p>
          {commitResult.errors.length > 0 && (
            <p className="mt-2 text-sm text-text-sub">{commitResult.errors.length} rows skipped (validation errors).</p>
          )}
        </GlassCard>
      )}
    </div>
  )
}
