// PATH: components/ui/PinkButton.tsx
'use client'
import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface PinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
}

export function PinkButton({ children, fullWidth = false, className = '', ...props }: PinkButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`relative overflow-hidden rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${fullWidth ? 'w-full' : ''} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}
