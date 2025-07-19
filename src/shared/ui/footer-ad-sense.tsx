'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

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

const FooterAdSlot = ({ includeDevice }: { includeDevice: Breakpoint[] }) => {
  const {
    adState: { isAdFilled, isDoneAd, isLoading },
    resetAdState,
    readyAdState,
    failAdState,
  } = useAdContext()
  const pathname = usePathname()
  const isClient = useClient()
  const breakpoint = useBreakpoint()
  const { refreshKey } = useAdRefresh()

  const adHeightClass = {
    ssr: 'h-[0px]',
    mobile: 'h-[60px]',
    tablet: 'h-[70px]',
    desktop: 'h-[90px]',
    'desktop-large': 'h-[90px]',
  }[breakpoint]

  // Breakpoint에 따른 광고 사이즈(px) 정의
  const adSlotClasses = {
    ssr: 'w-[0px] h-[0px]',
    mobile: 'w-[320px] h-[50px]',
    tablet: 'w-[468px] h-[60px]',
    desktop: 'w-[728px] h-[90px]',
    'desktop-large': 'w-[728px] h-[90px]',
  }[breakpoint]

  const [adKey, retryCount, retry, reset] = useAdRetryKey(
    `footer-ad-${breakpoint}`,
    MAX_RETRIES,
  )
  // 광고 로딩은 완료되었으나, 표시할 광고가 없는 상태
  const isAdUnFilledStatus = !isAdFilled && isDoneAd
  const shouldRender = isClient && includeDevice.includes(breakpoint)

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
      console.warn('🛑 광고 재시도 최대치 도달 — fallback 고려')
      failAdState()
    }
  }

  const handleFilled = () => {
    console.log('✅ 광고 성공적으로 로드됨')
    readyAdState()
  }

  if (!shouldRender) return null

  if (isDev) {
    return (
      <div
        className={cn(
          'bg-slate-100 pb-9 pc:bg-slate-200 pc:pb-0',
          pathname === '/guide' && 'bg-white',
          adHeightClass,
        )}
      >
        <div
          className={cn(
            'mx-auto rounded-sm bg-slate-300 pc:ml-auto pc:mr-0',
            adSlotClasses,
          )}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-slate-100 pb-9 pc:bg-slate-200 pc:pb-0',
        adHeightClass,
        isAdUnFilledStatus && 'hidden',
        pathname === '/guide' && 'bg-white',
      )}
    >
      {/* 광고 로딩 UI */}
      {isLoading ? (
        <Skeleton
          className={cn(
            'mx-auto rounded-sm bg-slate-300 pc:ml-auto pc:mr-0',
            adSlotClasses,
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
          className={cn(
            'mx-auto overflow-hidden rounded-sm pc:ml-auto pc:mr-0',
            adSlotClasses,
          )}
          data-ad-slot='4790060150'
          onAdFilled={handleFilled}
          onAdUnfilled={handleUnFilled}
          data-full-width-responsive='true'
        />
      </div>
    </div>
  )
}

const FooterAdSense = ({ includeDevice }: { includeDevice: Breakpoint[] }) => {
  return (
    <AdProvider>
      <FooterAdSlot includeDevice={includeDevice} />
    </AdProvider>
  )
}
export { FooterAdSense }
