'use client'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0f0a14] px-4 py-20 text-center md:py-28">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[680px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium tracking-widest text-white/60 uppercase">B2B &amp; B2C Platform</span>
        </div>

        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
          Premium Seafood,
          <br />
          <span className="italic text-primary">Delivered Right.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/50 md:text-lg">
          Sourced from the finest waters — frozen fresh for B2B wholesalers and B2C buyers worldwide.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-accent transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Browse Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/checkout"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/80 hover:border-white/30 hover:text-white hover:bg-white/10 transition-all"
          >
            View Cart
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-white/30">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            HACCP Certified
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Cold Chain Guaranteed
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Wholesale Available
          </span>
        </div>
      </div>
    </section>
  )
}
