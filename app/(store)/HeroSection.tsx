// PATH: app/(store)/HeroSection.tsx
'use client'
import { PinkButton } from '@/components/ui/PinkButton'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-soft via-surface to-white px-4 py-24 text-center">
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-text-main md:text-6xl">
        Refined. Simple. <span className="text-primary">Beautiful.</span>
      </h1>
      <p className="mx-auto mb-8 max-w-xl text-lg text-text-sub">
        Premium goods for discerning buyers — B2B and B2C, one seamless experience.
      </p>
      <Link href="/products">
        <PinkButton>Shop Now</PinkButton>
      </Link>
    </section>
  )
}
