'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import GoogleAdSense from '../lib/google-ad-sense'
import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { useBreakpoint } from '../lib/use-break-point'
import { useAdRetryKey } from '../lib/use-ad-retry-key'

const MAX_RETRIES = 3
const isDev = process.env.NODE_ENV === 'development'

const MainAdSense = () => {
  const pathname = usePathname()
  const isClient = useClient()
  const breakpoint = useBreakpoint()
  const [adKey, retryCount, retry, reset] = useAdRetryKey(
    `main-ad-${pathname}-${breakpoint}`,
    MAX_RETRIES,
  )

  useEffect(() => {
    reset()
  }, [pathname, breakpoint])

  const handleUnFilled = () => {
    if (retryCount < MAX_RETRIES) {
      retry()
      console.warn(`🔁 광고 재시도: ${retryCount + 1}/${MAX_RETRIES}`)
    } else {
      console.warn('🛑 광고 재시도 최대 도달 – fallback 고려')
    }
  }

  const handleFilled = () => {
    console.log('✅ 메인 광고 성공적으로 로드됨')
  }

  if (!isClient || breakpoint !== 'desktop') return null

  if (isDev) {
    return <div className={cn(AdStyle, 'bg-slate-300')} />
  }

  return (
    <GoogleAdSense
      key={adKey}
      className={AdStyle}
      data-ad-slot='9725653724'
      data-full-width-responsive='true'
      onAdFilled={handleFilled}
      onAdUnfilled={handleUnFilled}
    />
  )
}

const AdStyle =
  'my-24 h-[37.5rem] w-40 place-content-center overflow-hidden rounded-sm pc:ml-5 pc:block'

export { MainAdSense }
