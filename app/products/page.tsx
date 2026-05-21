import { createClient } from '@/lib/supabase/server'
import { CategoryFilter } from '@/components/ui/CategoryFilter'
import type { Product } from '@/lib/types'

export const metadata = {
  title: 'Products — Haitai',
}

const TAB_META: Record<string, { label: string; desc: string; badge?: string }> = {
  new: {
    label: 'New Items',
    desc: 'Freshly added products — be the first to order.',
    badge: 'NEW',
  },
  half: {
    label: '1/2 Price',
    desc: 'Special half-price deals — limited stock available.',
    badge: '50% OFF',
  },
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const tab = searchParams?.tab ?? null
  const supabase = await createClient()

  let query = supabase.from('products').select('*')

  if (tab === 'new') {
    query = query.order('created_at', { ascending: false })
  } else if (tab === 'half') {
    query = query.order('price', { ascending: true })
  } else {
    query = query.order('category', { ascending: true })
  }

  const { data: products } = await query
  const items = (products ?? []) as Product[]

  const meta = tab ? TAB_META[tab] : null
  const title = meta?.label ?? 'All Items'
  const desc = meta?.desc ?? 'Browse our full catalog — filter by category or search below.'

  return (
    <div>
      <div className="border-t-2 border-b-2 border-primary bg-white px-4 py-7 md:py-9">
        <div className="mx-auto max-w-7xl flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {tab === 'half' ? 'Special Deals' : tab === 'new' ? 'New Arrivals' : 'Catalog'}
            </p>
            <h1 className="font-display text-3xl font-bold text-text-main md:text-4xl flex items-center gap-3">
              {title}
              {meta?.badge && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                  tab === 'half' ? 'bg-primary text-white' : 'bg-soft text-primary'
                }`}>
                  {meta.badge}
                </span>
              )}
            </h1>
            <p className="mt-1.5 text-sm text-text-sub">{desc}</p>
          </div>
          <p className="hidden md:block mt-1 text-sm font-semibold text-text-sub pt-1">
            <span className="text-2xl font-display text-text-main">{items.length}</span>
            <br />items
          </p>
        </div>
      </div>
      <CategoryFilter products={items} activeTab={tab} />
    </div>
  )
}
