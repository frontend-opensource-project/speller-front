'use client'

import { useEffect, useRef, useCallback, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { useAdRetryKey } from '../lib/use-ad-retry-key'
import { AdProvider, useAdContext } from '../model/ad-context'
import { Skeleton } from './skeleton'
import { GenieeSSP, GenieeAdSlot, GENIEE_IDS } from '../lib/geniee-ssp'

const isDev = process.env.NODE_ENV === 'development'

// 경로 변경과 파라미터 변경에 대한 다른 시간 간격 설정
const PATH_CHANGE_INTERVAL = 5000 // 경로 변경 시 5초

const FooterGenieeSlot = ({
  includeDevice,
}: {
  includeDevice: Breakpoint[]
}) => {
  const {
    adState: { isAdFilled, isDoneAd, isLoading },
    resetAdState,
    readyAdState,
  } = useAdContext()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isClient = useClient()
  const breakpoint = useBreakpoint()

  // This identifier changes immediately with any relevant navigation, searchParams, or breakpoint change.
  const currentRawIdentifier = `${pathname}-${searchParams.toString()}-${breakpoint}`

  const adRefreshControl = useRef({
    lastEffectiveIdentifier: currentRawIdentifier, // Identifier for which an ad load was last permitted
    lastAdRefreshTime: 0,
    lastPath: pathname,
    lastSearchParams: searchParams.toString(),
    lastBreakpoint: breakpoint,
    isInitialRender: true,
  })

  // useAdRetryKey's key should change only when we *decide* to refresh the ad.
  // So, it uses `lastEffectiveIdentifier` from the ref.
  const [adKey, , , resetAdKeyAndRetries] = useAdRetryKey(
    `footer-geniee-${adRefreshControl.current.lastEffectiveIdentifier}`,
    0,
  )

  // 광고 로딩은 완료되었으나, 표시할 광고가 없는 상태
  const isAdUnFilledStatus = !isAdFilled && isDoneAd
  const shouldRender = isClient && includeDevice.includes(breakpoint)

  useEffect(() => {
    const refs = adRefreshControl.current
    const now = Date.now()
    let needsAdStateReset = false
    let newEffectiveIdentifier = refs.lastEffectiveIdentifier
    let reasonForRefresh = ''

    if (refs.isInitialRender) {
      refs.isInitialRender = false
      refs.lastAdRefreshTime = now
      refs.lastPath = pathname
      refs.lastSearchParams = searchParams.toString()
      refs.lastBreakpoint = breakpoint
      // `currentRawIdentifier` is already set as `lastEffectiveIdentifier`
      needsAdStateReset = true
      reasonForRefresh = '🚀 Initial Ad Setup'
    } else {
      const pathChanged = refs.lastPath !== pathname
      const searchParamsChanged =
        refs.lastSearchParams !== searchParams.toString()
      const breakpointChanged = refs.lastBreakpoint !== breakpoint

      let canRefreshThrottled = false

      if (breakpointChanged) {
        canRefreshThrottled = true
        reasonForRefresh = '📱 Breakpoint Change'
      } else if (searchParamsChanged) {
        canRefreshThrottled = true
        reasonForRefresh = '🔍 Search Params Change'
      } else if (pathChanged) {
        if (now - refs.lastAdRefreshTime >= PATH_CHANGE_INTERVAL) {
          canRefreshThrottled = true
          reasonForRefresh = '🌐 Path Change (Throttled)'
        } else {
          console.log(
            `⏱️ Path change to "${pathname}" detected, but throttled. ${Math.round(
              (PATH_CHANGE_INTERVAL - (now - refs.lastAdRefreshTime)) / 1000,
            )}s remaining.`,
          )
        }
      }

      if (canRefreshThrottled) {
        newEffectiveIdentifier = currentRawIdentifier // Update to the latest identifier
        if (refs.lastEffectiveIdentifier !== newEffectiveIdentifier) {
          // Only if the identifier that dictates the ad actually changes
          refs.lastEffectiveIdentifier = newEffectiveIdentifier
        }
        refs.lastAdRefreshTime = now
        refs.lastPath = pathname
        refs.lastSearchParams = searchParams.toString()
        refs.lastBreakpoint = breakpoint
        needsAdStateReset = true
      }
    }

    if (needsAdStateReset) {
      console.log(
        `${reasonForRefresh} - Geniee ad refresh triggered for identifier: ${refs.lastEffectiveIdentifier}`,
      )
      resetAdState() // Reset AdContext state (isLoading, isFilled, etc.)
      resetAdKeyAndRetries() // Reset retry count for the (potentially new) adKey
    }
  }, [
    pathname,
    searchParams,
    breakpoint,
    resetAdState,
    resetAdKeyAndRetries,
    currentRawIdentifier,
  ])

  const handleAdFilled = useCallback(() => {
    console.log(`✅ Geniee ad successfully loaded for key ${adKey}`)
    readyAdState()
  }, [readyAdState, adKey])

  const handleScriptReady = useCallback(() => {
    // Geniee SSP 스크립트 준비 완료 후 광고 로딩 상태로 전환
    setTimeout(() => {
      handleAdFilled() // 일단 로딩 완료로 처리 (실제로는 더 정교한 검증 필요)
    }, 1000)
  }, [handleAdFilled])

  if (!shouldRender) return null

  if (isDev) {
    return (
      <div
        className={cn(
          'flex h-full min-h-[6.25rem] w-full items-center justify-center overflow-hidden rounded-sm bg-slate-100 px-4 pb-9 tab:px-[3.75rem] pc:justify-end pc:bg-slate-200 pc:px-0 pc:pb-0',
          pathname === '/guide' && 'bg-white',
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
        'relative max-h-[6.5rem] min-h-[6.5rem] overflow-hidden rounded-sm bg-slate-100 pc:min-h-[6.25rem] pc:w-full pc:min-w-[31.25rem] pc:bg-slate-200 pc-lg:max-w-[45.5rem]',
        isAdUnFilledStatus && 'hidden',
        pathname === '/guide' && 'bg-white',
      )}
    >
      {/* Geniee SSP 스크립트 및 광고 요청 */}
      <GenieeSSP
        adIds={[GENIEE_IDS.OVERLAY_ID]}
        onScriptReady={handleScriptReady}
      />

      {/* 광고 로딩 UI */}
      {isLoading ? (
        <Skeleton
          className={cn(
            'absolute left-1/2 min-h-[6.25rem] w-full max-w-[29rem] -translate-x-1/2 overflow-hidden rounded-sm bg-slate-300 tab:max-w-[38rem] pc:w-full pc:min-w-[31.25rem] pc-lg:max-w-[45.5rem]',
            'pc:left-auto pc:right-0 pc:translate-x-0',
          )}
        />
      ) : null}
      <div
        className={cn(
          'relative grid min-h-[6.25rem] items-center justify-items-center transition-opacity pc:justify-items-end',
          isLoading ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <GenieeAdSlot
          key={adKey}
          adId={GENIEE_IDS.OVERLAY_ID}
          className={cn(
            'h-full max-h-[6.25rem] w-full max-w-[29rem] overflow-hidden rounded-sm tab:max-w-[38rem] pc-lg:max-w-[45.5rem]',
          )}
        />
      </div>
    </div>
  )
}

const FooterGeniee = ({ includeDevice }: { includeDevice: Breakpoint[] }) => {
  const adBlockDetected = useDetectAdBlock()
  const isClient = useClient()

  if (!isClient || adBlockDetected) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <AdProvider>
        <FooterGenieeSlot includeDevice={includeDevice} />
      </AdProvider>
    </Suspense>
  )
}

export { FooterGeniee }
