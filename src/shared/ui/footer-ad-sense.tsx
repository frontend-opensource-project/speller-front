'use client'

import { useEffect } from 'react'

import GoogleAdSense from '../lib/google-ad-sense'
import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { useBreakpoint } from '../lib/use-break-point'
import { useAdRetryKey } from '../lib/use-ad-retry-key'

const MAX_RETRIES = 3
const isDev = process.env.NODE_ENV === 'development'

const FooterAdSense = () => {
  const isClient = useClient()
  const breakpoint = useBreakpoint()
  const [adKey, retryCount, retry, reset] = useAdRetryKey(
    `footer-ad-${breakpoint}`,
    MAX_RETRIES,
  )

  useEffect(() => {
    reset() // breakpoint가 변경될 때 광고 키 리셋
  }, [breakpoint])

  const handleUnFilled = () => {
    if (retryCount < MAX_RETRIES) {
      retry()
      console.warn(`🔁 광고 재시도: ${retryCount + 1}/${MAX_RETRIES}`)
    } else {
      console.warn('🛑 광고 재시도 최대치 도달 — fallback 고려')
    }
  }

  const handleFilled = () => {
    console.log('✅ 광고 성공적으로 로드됨')
  }

  if (!isClient) return null

  if (isDev) {
    return <div className={cn(AdStyle, 'bg-slate-300')} />
  }
  return (
    <GoogleAdSense
      key={adKey}
      className={AdStyle}
      data-ad-slot='4790060150'
      data-full-width-responsive='true'
      onAdFilled={handleFilled}
      onAdUnfilled={handleUnFilled}
    />
  )
}

const AdStyle =
  'mb-1 h-[6.25rem] w-full max-w-[31.25rem] overflow-hidden rounded-sm tab:max-w-[728px]'

export { FooterAdSense }
