/** Canonical production domain for this app. */
const PRODUCTION_URL = 'https://dark4096.cartagenacorporation.com'

/**
 * Resolves the canonical site URL used for SEO metadata (Open Graph images,
 * canonical links, sitemap, robots). Order of precedence:
 *  1. NEXT_PUBLIC_SITE_URL — overrides everything (e.g. staging/preview).
 *  2. PRODUCTION_URL — the canonical production domain.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  return PRODUCTION_URL
}

export const SITE_NAME = '4096 Dark'
