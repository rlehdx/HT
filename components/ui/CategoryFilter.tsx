'use client'
import { useState, useMemo } from 'react'
import { ProductCard } from '@/app/ProductCard'
import type { Product } from '@/lib/types'

const CATEGORY_ICONS: Record<string, string> = {
  'All': '🛒',
  'Frozen': '❄️',
  'Fresh': '🌿',
  'Dried': '☀️',
  'Canned': '🥫',
  'Seafood': '🐟',
  'Meat': '🥩',
  'Vegetables': '🥦',
  'Fruits': '🍎',
  'Grains': '🌾',
  'Dairy': '🧀',
  'Snacks': '🍿',
  'Beverages': '🧃',
  'Other': '📦',
}

function getCategoryIcon(cat: string) {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '📦'
}

const SORT_OPTIONS = [
  { value: 'default', label: '기본 정렬' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'name_asc', label: '이름순 (A-Z)' },
  { value: 'stock_desc', label: '재고 많은순' },
]

interface CategoryFilterProps {
  products: Product[]
}

export function CategoryFilter({ products }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    return ['All', ...cats.sort()]
  }, [products])

  const filtered = useMemo(() => {
    let list = products

    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'price_asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price_desc': return [...list].sort((a, b) => b.price - a.price)
      case 'name_asc': return [...list].sort((a, b) => a.name.localeCompare(b.name))
      case 'stock_desc': return [...list].sort((a, b) => b.stock - a.stock)
      default: return list
    }
  }, [products, selectedCategory, sortBy, searchQuery])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length }
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [products])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
      {/* 검색바 */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="상품 검색..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-text-main placeholder:text-text-sub focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-text-sub hover:text-text-main"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* 카테고리 사이드바 (데스크탑) / 탭 스크롤 (모바일) */}
        <aside className="lg:w-52 lg:flex-shrink-0">
          {/* 모바일: 가로 스크롤 탭 */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-border text-text-sub hover:border-primary hover:text-primary'
                }`}
              >
                <span>{getCategoryIcon(cat)}</span>
                <span>{cat}</span>
                <span className={`text-xs ${selectedCategory === cat ? 'text-white/70' : 'text-text-sub'}`}>
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* 데스크탑: 세로 사이드바 */}
          <div className="hidden lg:block sticky top-24">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-sub">카테고리</p>
            <ul className="space-y-1">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`group w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-white font-semibold'
                        : 'text-text-sub hover:bg-soft/50 hover:text-text-main'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{getCategoryIcon(cat)}</span>
                      <span>{cat}</span>
                    </span>
                    <span className={`text-xs rounded-full px-1.5 py-0.5 ${
                      selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-soft text-text-sub'
                    }`}>
                      {categoryCounts[cat] ?? 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* 상품 목록 */}
        <div className="flex-1 min-w-0">
          {/* 상단 바: 결과 수 + 정렬 */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-text-sub">
              <span className="font-semibold text-text-main">{filtered.length}</span>개 상품
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-16 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-text-main">상품을 찾을 수 없습니다</p>
              <p className="mt-1 text-sm text-text-sub">다른 카테고리나 검색어를 시도해보세요</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery('') }}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent transition-colors"
              >
                전체 보기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
