'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/shared/lib/send-page-view-event'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    setTimeout(() => {
      const title = document.title
      pageview(url, title)
    }, 0)
  }, [pathname, searchParams])

  return null
}
