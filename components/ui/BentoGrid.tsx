// PATH: components/ui/BentoGrid.tsx
import type { ReactNode } from 'react'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid auto-rows-[minmax(120px,auto)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {children}
    </div>
  )
}

interface BentoCellProps {
  children: ReactNode
  className?: string
  span?: 1 | 2 | 3
}

export function BentoCell({ children, className = '', span = 1 }: BentoCellProps) {
  const spanClass = span === 2 ? 'md:col-span-2' : span === 3 ? 'lg:col-span-3' : ''
  return (
    <div className={`${spanClass} ${className}`}>
      {children}
    </div>
  )
}
