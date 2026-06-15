'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const TABS = [
  {
    label: 'Guide',
    href: '/order-guide',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'All Items',
    href: '/products',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    label: 'New',
    href: '/products?tab=new',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Sale',
    href: '/products?tab=half',
    highlight: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M17 17h.01M7 7L17 17M7 17L17 7" />
      </svg>
    ),
  },
]

export function MobileTabBar() {
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-white/95 backdrop-blur-md">
      <div className="grid grid-cols-4">
        {TABS.map((tab) => {
          const active = isActive(tab)
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                active
                  ? 'text-primary'
                  : tab.highlight
                  ? 'text-primary/60 hover:text-primary'
                  : 'text-text-sub hover:text-text-main'
              }`}
            >
              <span className={`${active ? 'text-primary' : ''}`}>{tab.icon}</span>
              <span>{tab.label}</span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
