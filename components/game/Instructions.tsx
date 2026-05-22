'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/hooks/use-i18n'

export const Instructions = memo(function Instructions() {
  const { t } = useI18n()
  const body = t('howToPlayBody')
  const [before, after] = body.split('4096')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="w-full"
    >
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <strong style={{ color: 'var(--foreground)' }}>{t('howToPlayTitle')}</strong>{' '}
        {after !== undefined ? (
          <>
            {before}
            <strong style={{ color: 'var(--primary)' }}>4096</strong>
            {after}
          </>
        ) : (
          body
        )}
      </p>
    </motion.div>
  )
})
