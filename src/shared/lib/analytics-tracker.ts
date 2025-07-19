'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/shared/lib/send-page-view-event'
import { useAdRefresh } from '@/shared/lib/ad-refresh-context'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { triggerAdRefresh } = useAdRefresh()

  useEffect(() => {
    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    setTimeout(() => {
      const title = document.title
      pageview(url, title)
      triggerAdRefresh()
    }, 0)
  }, [pathname, searchParams, triggerAdRefresh])

  return null
}
