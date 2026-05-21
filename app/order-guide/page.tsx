export const metadata = {
  title: 'Order Guide — Haitai',
}

const STEPS = [
  {
    step: '01',
    title: 'Browse & Select',
    desc: 'Use the All Items tab to browse our full catalog. Filter by category or search by name/SKU. New Items shows the latest arrivals, and 1/2 Price shows current deals.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Add to Cart',
    desc: 'Click "Add to Cart" on any product. You can adjust quantities in the cart before checkout. Stock levels are shown in real time.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Sign In',
    desc: 'Sign in to your account (or register) to proceed. B2B customers will see wholesale pricing automatically applied to their account.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Checkout',
    desc: 'Review your order, confirm quantities, and submit. You\'ll receive an order confirmation. Our team processes B2B orders within 1 business day.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const FAQS = [
  {
    q: 'What is the minimum order quantity?',
    a: 'There is no minimum order for B2C customers. B2B customers have category-specific minimums shown on each product page.',
  },
  {
    q: 'How does 1/2 Price work?',
    a: 'Half-price items are products we are clearing from inventory. Stock is limited and updated daily. Prices shown are already discounted — no additional code needed.',
  },
  {
    q: 'What are New Items?',
    a: 'New Items shows products added in the last 30 days. These are the freshest additions to our catalog.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard: 3–5 business days. Express: 1–2 business days. B2B bulk orders: contact us for freight options.',
  },
  {
    q: 'Can I modify an order after placing it?',
    a: 'Contact orders@haetae.com within 2 hours of placing your order. After that, we cannot guarantee changes.',
  },
]

export default function OrderGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      {/* Hero */}
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Getting Started</p>
        <h1 className="font-display text-4xl font-bold text-text-main md:text-5xl">Order Guide</h1>
        <p className="mt-4 text-base text-text-sub max-w-lg mx-auto leading-relaxed">
          Everything you need to know about ordering from Haitai — from browsing to checkout.
        </p>
      </div>

      {/* Steps */}
      <div className="mb-16 grid gap-4 sm:grid-cols-2">
        {STEPS.map((step) => (
          <div key={step.step} className="rounded-2xl border border-border bg-white p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-primary">
                {step.icon}
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-bold text-primary/50 tracking-widest">STEP {step.step}</span>
              </div>
              <h3 className="font-semibold text-text-main mb-1.5">{step.title}</h3>
              <p className="text-sm text-text-sub leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab guide */}
      <div className="mb-16 rounded-2xl border border-border bg-white overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-display text-xl font-bold text-text-main">Understanding the Tabs</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { tab: 'All Items', color: 'bg-soft text-primary', desc: 'The full catalog. Filter by category, sort by price, or search by name or SKU.' },
            { tab: 'New Items', color: 'bg-soft text-primary', badge: 'NEW', desc: 'Products added in the last 30 days. Sorted by newest first.' },
            { tab: '1/2 Price', color: 'bg-primary text-white', badge: '50%', desc: 'Clearance items at half price. Limited stock — first come, first served.' },
            { tab: 'Order Guide', color: 'bg-soft text-text-sub', desc: 'This page. How-to guide, FAQ, and contact info.' },
          ].map(({ tab, color, badge, desc }) => (
            <div key={tab} className="flex items-start gap-4 px-6 py-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0 mt-0.5 ${color}`}>
                {tab}
                {badge && <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${color.includes('bg-primary') ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>{badge}</span>}
              </span>
              <p className="text-sm text-text-sub leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="font-display text-2xl font-bold text-text-main mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-border bg-white p-5">
              <p className="font-semibold text-text-main mb-2">{faq.q}</p>
              <p className="text-sm text-text-sub leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="rounded-2xl bg-soft border border-border/60 p-8 text-center">
        <h3 className="font-display text-xl font-bold text-text-main mb-2">Still have questions?</h3>
        <p className="text-sm text-text-sub mb-5">Our team is happy to help with B2B inquiries, wholesale pricing, and custom orders.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:orders@haetae.com"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            orders@haetae.com
          </a>
          <a
            href="mailto:biz@haetae.com"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-text-main hover:border-primary hover:text-primary transition-colors"
          >
            B2B Inquiries: biz@haetae.com
          </a>
        </div>
      </div>
    </div>
  )
}
