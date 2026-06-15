// PATH: app/(admin)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/ui/GlassCard'
import { StockBadge } from '@/components/ui/StockBadge'
import { BentoGrid, BentoCell } from '@/components/ui/BentoGrid'
import type { Product, Order } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: orders }] = await Promise.all([
    supabase.from('products').select('*').order('stock', { ascending: true }).limit(20),
    supabase.from('orders').select('id, status, total_amount, type, created_at').order('created_at', { ascending: false }).limit(10),
  ])

  const items = (products ?? []) as Product[]
  const orderList = (orders ?? []) as Order[]

  const totalRevenue = orderList.reduce((s, o) => s + o.total_amount, 0)
  const lowStockCount = items.filter(p => p.stock > 0 && p.stock < 20).length
  const outOfStockCount = items.filter(p => p.stock === 0).length

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-text-main">Dashboard</h1>
      <BentoGrid className="mb-8">
        <BentoCell>
          <GlassCard>
            <p className="text-xs font-medium uppercase tracking-wide text-text-sub">Total Products</p>
            <p className="mt-2 text-4xl font-bold text-primary">{items.length}</p>
          </GlassCard>
        </BentoCell>
        <BentoCell>
          <GlassCard>
            <p className="text-xs font-medium uppercase tracking-wide text-text-sub">Recent Orders</p>
            <p className="mt-2 text-4xl font-bold text-primary">{orderList.length}</p>
          </GlassCard>
        </BentoCell>
        <BentoCell>
          <GlassCard>
            <p className="text-xs font-medium uppercase tracking-wide text-text-sub">Revenue</p>
            <p className="mt-2 text-4xl font-bold text-primary">${totalRevenue.toFixed(0)}</p>
          </GlassCard>
        </BentoCell>
        <BentoCell>
          <GlassCard>
            <p className="text-xs font-medium uppercase tracking-wide text-text-sub">Low Stock</p>
            <p className="mt-2 text-4xl font-bold text-yellow-600">{lowStockCount}</p>
          </GlassCard>
        </BentoCell>
        <BentoCell>
          <GlassCard>
            <p className="text-xs font-medium uppercase tracking-wide text-text-sub">Out of Stock</p>
            <p className="mt-2 text-4xl font-bold text-red-600">{outOfStockCount}</p>
          </GlassCard>
        </BentoCell>

        <BentoCell span={2}>
          <GlassCard className="h-full">
            <h2 className="mb-4 font-semibold text-text-main">Recent Orders</h2>
            <ul className="space-y-2">
              {orderList.map(o => (
                <li key={o.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-mono text-xs text-text-sub">{o.id.slice(0, 8)}…</span>
                    <span className="ml-2 rounded-full bg-soft px-2 py-0.5 text-xs text-text-main">{o.type.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-medium">${o.total_amount.toFixed(2)}</span>
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-text-main">{o.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        </BentoCell>

        <BentoCell span={3}>
          <GlassCard>
            <h2 className="mb-4 font-semibold text-text-main">Inventory (by Stock)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-text-sub">
                    <th className="pb-2 pr-4">SKU</th>
                    <th className="pb-2 pr-4">Name</th>
                    <th className="pb-2 pr-4">Category</th>
                    <th className="pb-2 pr-4">Price</th>
                    <th className="pb-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(p => (
                    <tr key={p.id} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-mono text-xs text-text-sub">{p.sku}</td>
                      <td className="py-2 pr-4 text-text-main">{p.name}</td>
                      <td className="py-2 pr-4 text-text-sub">{p.category}</td>
                      <td className="py-2 pr-4 text-primary font-medium">${p.price.toFixed(2)}</td>
                      <td className="py-2"><StockBadge stock={p.stock} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </BentoCell>
      </BentoGrid>
    </div>
  )
}
