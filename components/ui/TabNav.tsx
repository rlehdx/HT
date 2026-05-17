'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const TABS = [
  {
    label: 'Order Guide',
    href: '/order-guide',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'All Items',
    href: '/products',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    label: 'New Items',
    href: '/products?tab=new',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badge: 'NEW',
  },
  {
    label: '1/2 Price',
    href: '/products?tab=half',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M17 17h.01M7 7L17 17M7 17L17 7" />
      </svg>
    ),
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
    <nav className="hidden md:block border-b border-border/60 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-0">
          {TABS.map((tab) => {
            const active = isActive(tab)
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`
                  relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all
                  border-b-2 -mb-px
                  ${active
                    ? tab.highlight
                      ? 'border-primary text-primary'
                      : 'border-primary text-primary'
                    : 'border-transparent text-text-sub hover:text-text-main hover:border-border'
                  }
                  ${tab.highlight && !active ? 'text-primary/70 hover:text-primary' : ''}
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`
                    ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none
                    ${tab.highlight
                      ? 'bg-primary text-white'
                      : 'bg-soft text-primary'
                    }
                  `}>
                    {tab.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
