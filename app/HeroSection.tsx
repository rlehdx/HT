'use client'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 text-center md:py-24">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-soft/60 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/20 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-4">
          B2B &amp; B2C 통합 플랫폼
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-text-main sm:text-5xl md:text-6xl">
          Refined. Simple.{' '}
          <span className="text-primary">Beautiful.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-text-sub md:text-lg">
          엄선된 해산물 및 식품을 B2B·B2C 통합 방식으로 경험하세요.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent transition-colors active:scale-[0.98]"
          >
            지금 쇼핑하기
          </Link>
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-text-main hover:border-primary hover:text-primary transition-colors"
          >
            장바구니 보기
          </Link>
        </div>
      </div>
    </section>
  )
}
