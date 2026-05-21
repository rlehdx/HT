'use client'
import { useState, useMemo } from 'react'
import { ProductCard } from '@/app/ProductCard'
import type { Product } from '@/lib/types'

const CATEGORY_ICONS: Record<string, string> = {
  'All': '🛒',
  'Fresh': '🌿',
  'Dried': '☀️',
  'Canned': '🥫',
  'Meat': '🥩',
  'Vegetables': '🥦',
  'Fruits': '🍎',
  'Grains': '🌾',
  'Dairy': '🧀',
  'Snacks': '🍿',
  'Beverages': '🧃',
}

function getCategoryIcon(cat: string) {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '📦'
}

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
  { value: 'stock_desc', label: 'Most In Stock' },
]

interface CategoryFilterProps {
  products: Product[]
  activeTab?: string | null
}

const CHOSUNG_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

function getChosung(str: string): string {
  return [...str].map(ch => {
    const code = ch.charCodeAt(0) - 0xAC00
    if (code < 0 || code > 11171) return ch
    return CHOSUNG_LIST[Math.floor(code / 28 / 21)]
  }).join('')
}

function isChosungOnly(str: string): boolean {
  return /^[ㄱ-ㅎ]+$/.test(str)
}

export function CategoryFilter({ products, activeTab }: CategoryFilterProps) {
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
      const q = searchQuery.trim()
      const qLower = q.toLowerCase()
      const chosung = isChosungOnly(q)
      list = list.filter(p => {
        if (chosung) {
          return getChosung(p.name).includes(q) ||
            getChosung(p.category ?? '').includes(q) ||
            getChosung(p.sku).includes(q)
        }
        return (
          p.name.toLowerCase().includes(qLower) ||
          p.category?.toLowerCase().includes(qLower) ||
          p.sku.toLowerCase().includes(qLower)
        )
      })
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
      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search products by name, SKU or category…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-10 text-sm text-text-main placeholder:text-text-sub focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
        {/* Sidebar (desktop) / Scroll tabs (mobile) */}
        <aside className="lg:w-52 lg:flex-shrink-0">
          {/* Mobile: horizontal scroll tabs */}
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

          {/* Desktop: vertical sidebar */}
          <div className="hidden lg:block sticky top-24">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-sub">Categories</p>
            <ul className="space-y-0.5">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`group w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-white font-semibold'
                        : 'text-text-sub hover:bg-soft/60 hover:text-text-main'
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

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-text-sub">
              <span className="font-semibold text-text-main">{filtered.length}</span> products
              {selectedCategory !== 'All' && (
                <span> in <span className="font-medium text-primary">{selectedCategory}</span></span>
              )}
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
              <p className="font-semibold text-text-main">No products found</p>
              <p className="mt-1 text-sm text-text-sub">Try a different category or search term.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery('') }}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent transition-colors"
              >
                Show all products
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
