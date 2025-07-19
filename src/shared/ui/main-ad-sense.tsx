'use client'

import { useEffect } from 'react'

import GoogleAdSense from '../lib/google-ad-sense'
import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { useAdRetryKey } from '../lib/use-ad-retry-key'
import { AdProvider, useAdContext } from '../model/ad-context'
import { Skeleton } from './skeleton'
import { useAdRefresh } from '@/shared/lib/ad-refresh-context'

const MAX_RETRIES = 0
const isDev = process.env.NODE_ENV === 'development'

const MainAdSlot = () => {
  const {
    adState: { isAdFilled, isDoneAd, isLoading },
    resetAdState,
    readyAdState,
    failAdState,
  } = useAdContext()
  const isClient = useClient()
  const breakpoint = useBreakpoint()
  const { refreshKey } = useAdRefresh()

  const [adKey, retryCount, retry, reset] = useAdRetryKey(
    `main-ad-${breakpoint}`,
    MAX_RETRIES,
  )
  const allowedBreakpoints: Breakpoint[] = ['desktop', 'desktop-large']
  // 광고 로딩은 완료되었으나, 표시할 광고가 없는 상태
  const isAdUnFilledStatus = !isAdFilled && isDoneAd
  const shouldRender = isClient && allowedBreakpoints.includes(breakpoint)

  useEffect(() => {
    console.log(
      '🔄️ Ad state reset triggered by refreshKey or breakpoint change.',
    )
    reset()
    resetAdState()
  }, [refreshKey, breakpoint, reset, resetAdState])

  const handleUnFilled = () => {
    if (retryCount < MAX_RETRIES) {
      retry()
      console.warn(`🔁 광고 재시도: ${retryCount + 1}/${MAX_RETRIES}`)
    } else {
      console.warn('🛑 광고 재시도 최대 도달 – fallback 고려')
      failAdState()
    }
  }

  const handleFilled = () => {
    console.log('✅ 메인 광고 성공적으로 로드됨')
    readyAdState()
  }

  if (!shouldRender) return null

  if (isDev) {
    return <div className={cn(AdStyle, 'bg-slate-300')} />
  }

  return (
    <div className={cn('relative', isAdUnFilledStatus && 'hidden')}>
      {/* 광고 로딩 UI */}
      {isLoading ? (
        <Skeleton
          className={cn(AdStyle, 'absolute inset-0 m-auto bg-slate-300')}
        />
      ) : null}
      <div
        className={cn(
          'transition-opacity',
          isLoading ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <GoogleAdSense
          key={adKey}
          className={AdStyle}
          data-ad-slot='9725653724'
          data-full-width-responsive='true'
          onAdFilled={handleFilled}
          onAdUnfilled={handleUnFilled}
        />
      </div>
    </div>
  )
}

const AdStyle =
  'my-24 h-[37.5rem] w-40 self-center overflow-hidden rounded-sm pc:ml-5 pc:block'

const MainAdSense = () => {
  return (
    <AdProvider>
      <MainAdSlot />
    </AdProvider>
  )
}

export { MainAdSense }
