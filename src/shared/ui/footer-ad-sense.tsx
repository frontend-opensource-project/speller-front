'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import GoogleAdSense from '../lib/google-ad-sense'
import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { useBreakpoint } from '../lib/use-break-point'
import { useAdRetryKey } from '../lib/use-ad-retry-key'
import { useAdContext } from '../model/ad-context'
import { Skeleton } from './skeleton'
import { useDesktopDevice } from '../lib/use-desktop'

const MAX_RETRIES = 3
const isDev = process.env.NODE_ENV === 'development'

const FooterAdSense = () => {
  const {
    adState: { isAdFilled, isDoneAd, isLoading },
    resetAdState,
    readyAdState,
    failAdState,
  } = useAdContext()
  const pathname = usePathname()
  const isClient = useClient()
  const breakpoint = useBreakpoint()
  const isDesktop = useDesktopDevice()
  const [adKey, retryCount, retry, reset] = useAdRetryKey(
    `footer-ad-${pathname}-${breakpoint}`,
    MAX_RETRIES,
  )
  // 광고 로딩은 완료되었으나, 표시할 광고가 없는 상태
  const isAdUnFilledStatus = !isAdFilled && isDoneAd
  // 모바일에서는 반복적인 깜빡임 이슈로 스켈레톤 비활성화 → 데스크톱에서만 표시
  const showSkeletonOnDesktopOnly = isLoading && isDesktop

  useEffect(() => {
    reset()
    resetAdState()

    return () => {
      reset()
      resetAdState()
    }
  }, [pathname, breakpoint])

  const handleUnFilled = () => {
    if (retryCount < MAX_RETRIES) {
      retry()
      console.warn(`🔁 광고 재시도: ${retryCount + 1}/${MAX_RETRIES}`)
    } else {
      console.warn('🛑 광고 재시도 최대치 도달 — fallback 고려')
      failAdState()
    }
  }

  const handleFilled = () => {
    console.log('✅ 광고 성공적으로 로드됨')
    readyAdState()
  }

  if (!isClient) return null

  if (isDev) {
    return (
      <div className={AdContainerStyle}>
        <div className={cn(AdStyle, 'min-h-[6.25rem] bg-slate-300')}></div>
      </div>
    )
  }

  return (
    <div className={cn(AdContainerStyle, isAdUnFilledStatus && 'hidden')}>
      {/* 광고 로딩 UI */}
      {showSkeletonOnDesktopOnly ? (
        <Skeleton
          className={cn(
            AdStyle,
            'min-h-[6.25rem] rounded-none bg-slate-300 pc-lg:min-w-[45.5rem]',
          )}
        />
      ) : null}
      <div
        className={cn(
          'transition-opacity',
          isLoading ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <GoogleAdSense
          key={`${adKey}-${retryCount}`}
          className={AdStyle}
          data-ad-slot='4790060150'
          data-full-width-responsive='true'
          onAdFilled={handleFilled}
          onAdUnfilled={handleUnFilled}
        />
      </div>
    </div>
  )
}

const AdContainerStyle =
  'fixed bottom-0 flex h-full max-h-[6.25rem] min-h-[6.25rem] w-full items-center justify-center overflow-hidden bg-transparent pc:static pc:justify-end pc:rounded-sm'
const AdStyle =
  'h-auto w-full max-w-[31.25rem] self-center overflow-hidden tab:max-w-[45.5rem] tab:rounded-sm'

export { FooterAdSense }
