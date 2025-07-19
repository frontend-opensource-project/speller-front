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

const CenterAdSlot = ({ includeDevice }: { includeDevice: Breakpoint[] }) => {
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
    `center-ad-${breakpoint}`,
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
          'flex h-full min-h-[6.25rem] w-full items-center justify-center overflow-hidden rounded-sm bg-slate-100 px-4 pb-9 tab:px-[3.75rem] pc:justify-end pc:bg-slate-200 pc:px-0 pc:pb-0',
        )}
      >
        <div
          className={cn(
            'flex min-h-[6.25rem] w-full max-w-[29rem] items-center justify-center self-center overflow-hidden rounded-sm bg-slate-300 tab:max-w-[38rem] pc-lg:max-w-[45.5rem]',
          )}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative max-h-[3.75rem] min-h-[3.75rem] overflow-hidden rounded-sm bg-slate-100 pc:max-h-[6.25rem] pc:min-h-[6.25rem] pc:w-full pc:min-w-[31.25rem] pc:bg-slate-200 pc-lg:max-w-[45.5rem]',
        isAdUnFilledStatus && 'hidden',
      )}
    >
      {/* 광고 로딩 UI */}
      {isLoading ? (
        <Skeleton
          className={cn(
            'absolute left-1/2 min-h-[3.75rem] w-full max-w-[29rem] -translate-x-1/2 overflow-hidden rounded-sm bg-slate-300 tab:max-w-[38rem] pc:w-full pc:min-w-[31.25rem] pc-lg:max-w-[45.5rem]',
            'pc:left-auto pc:right-0 pc:translate-x-0',
          )}
        />
      ) : null}
      <div
        className={cn(
          'relative grid max-h-[3.75rem] min-h-[3.75rem] items-center justify-items-center transition-opacity pc:justify-items-end',
          isLoading ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <GoogleAdSense
          key={`${adKey}-${retryCount}`}
          className={cn(
            'h-full max-h-[3.75rem] w-full max-w-[29rem] overflow-hidden rounded-sm tab:max-w-[38rem] pc-lg:max-w-[45.5rem]',
          )}
          data-ad-slot='2100480309'
          onAdFilled={handleFilled}
          onAdUnfilled={handleUnFilled}
        />
      </div>
    </div>
  )
}

const CenterAdSense = ({ includeDevice }: { includeDevice: Breakpoint[] }) => {
  return (
    <AdProvider>
      <CenterAdSlot includeDevice={includeDevice} />
    </AdProvider>
  )
}
export { CenterAdSense }
