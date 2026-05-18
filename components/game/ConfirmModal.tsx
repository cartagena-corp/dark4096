'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(8px)', backgroundColor: 'oklch(0 0 0 / 0.4)' }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
          >
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              {title}
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
                style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
