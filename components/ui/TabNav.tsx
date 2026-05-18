'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const TABS = [
  {
    label: 'Order Guide',
    href: '/order-guide',
  },
  {
    label: 'All Items',
    href: '/products',
  },
  {
    label: 'New Items',
    href: '/products?tab=new',
    badge: 'NEW',
  },
  {
    label: 'Sale',
    href: '/products?tab=half',
    badge: '50%',
    highlight: true,
  },
]

export function TabNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')

  function isActive(tab: typeof TABS[0]) {
    if (tab.href === '/products') {
      return pathname === '/products' && !currentTab
    }
    if (tab.href.includes('?tab=')) {
      const tabParam = tab.href.split('?tab=')[1]
      return pathname === '/products' && currentTab === tabParam
    }
    return pathname === tab.href || pathname.startsWith(tab.href + '/')
  }

  return (
    <nav className="hidden md:flex items-center gap-1">
      {TABS.map((tab) => {
        const active = isActive(tab)
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg
              text-base font-semibold tracking-tight transition-all
              ${active
                ? tab.highlight
                  ? 'text-primary'
                  : 'text-primary'
                : tab.highlight
                  ? 'text-primary/70 hover:text-primary hover:bg-soft/60'
                  : 'text-text-sub hover:text-text-main hover:bg-soft/60'
              }
            `}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`
                rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none
                ${tab.highlight
                  ? 'bg-primary text-white'
                  : 'bg-soft text-primary'
                }
              `}>
                {tab.badge}
              </span>
            )}
            {active && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
