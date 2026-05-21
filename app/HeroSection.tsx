'use client'

import Link from 'next/link'

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={`relative overflow-hidden min-h-[640px] flex flex-col ${className ?? ''}`}
      style={{ background: '#FFF8F0' }}
    >
      {/* Decorative background circles */}
      <div
        className="pointer-events-none absolute"
        style={{ top: '-120px', right: '-100px' }}
      >
        <div style={{ width: 480, height: 480, borderRadius: '50%', background: 'rgba(232,0,26,0.08)' }} />
      </div>
      <div
        className="pointer-events-none absolute"
        style={{ bottom: '-80px', left: '-60px' }}
      >
        <div style={{ width: 280, height: 280, borderRadius: '50%', background: 'rgba(232,0,26,0.05)' }} />
      </div>

      {/* Text content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center flex-1 px-8 md:px-16 py-20">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#E8001A]">
          Since 1945 · Korea's #1 Snack Brand
        </p>

        <h1
          className="font-display font-black leading-none tracking-tight text-gray-900"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', lineHeight: 1.05 }}
        >
          Taste Korea's
          <br />
          <span style={{ color: '#E8001A' }}>Finest Snacks.</span>
        </h1>

        <p className="mt-5 text-base text-gray-500 max-w-md">
          From crispy rice crackers to beloved cookies — authentic Haitai snacks delivered to your door.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: '#E8001A', boxShadow: '0 8px 24px rgba(232,0,26,0.35)' }}
          >
            Shop Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/products?filter=new"
            className="inline-flex items-center gap-2 rounded-xl border-2 px-7 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5"
            style={{ borderColor: '#E8001A', color: '#E8001A' }}
          >
            New Arrivals
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap gap-6 text-xs text-gray-400 font-medium">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#E8001A]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
            </svg>
            10,000+ Orders
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#E8001A]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.98-.804l1-5A1 1 0 0015 7h-5V5a1 1 0 00-1-1H3z" />
            </svg>
            Free Shipping over $30
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#E8001A]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Authentic Products
          </span>
        </div>
      </div>
    </section>
  )
}
