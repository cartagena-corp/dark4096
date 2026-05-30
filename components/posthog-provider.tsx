'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const phInstance = usePostHog()

  useEffect(() => {
    if (pathname && phInstance) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) url += '?' + search
      phInstance.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams, phInstance])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // We handle this manually
      capture_pageleave: true,
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
