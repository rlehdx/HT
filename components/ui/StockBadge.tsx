interface StockBadgeProps {
  stock: number
  compact?: boolean
}

export function StockBadge({ stock, compact = false }: StockBadgeProps) {
  if (compact) {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 leading-tight">
          품절
        </span>
      )
    }
    if (stock < 20) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 leading-tight">
          소량
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 leading-tight">
        재고↑
      </span>
    )
  }

  if (stock === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
        Out of Stock
      </span>
    )
  }
  if (stock < 20) {
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
        Low Stock ({stock})
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
      In Stock ({stock})
    </span>
  )
}
