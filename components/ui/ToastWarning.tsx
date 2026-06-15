// PATH: components/ui/ToastWarning.tsx
'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastWarningProps {
  message: string
  onDismiss: () => void
}

export function ToastWarning({ message, onDismiss }: ToastWarningProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-border bg-surface px-5 py-4 shadow-lg"
    >
      <p className="text-sm font-medium text-text-main">{message}</p>
      <button
        onClick={onDismiss}
        className="mt-2 text-xs text-text-sub underline"
      >
        Dismiss
      </button>
    </motion.div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([])

  const addToast = (message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}
