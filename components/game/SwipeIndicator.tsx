'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/hooks/use-i18n'

export const SwipeIndicator = memo(function SwipeIndicator() {
  const { t } = useI18n()
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="flex items-center justify-center gap-2 mt-2 sm:hidden"
      aria-hidden="true"
    >
      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
        {t('swipeHint')}
      </span>
    </motion.div>
  )
})
