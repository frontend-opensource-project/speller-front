'use client'

import { useEffect, useRef, useCallback } from 'react'
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

const MainGenieeSlot = () => {
  const {
    adState: { isAdFilled, isDoneAd, isLoading },
    resetAdState,
    readyAdState,
  } = useAdContext()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isClient = useClient()
  const breakpoint = useBreakpoint()

  const searchParamsString = searchParams?.toString() || ''

  // This identifier changes immediately with any relevant navigation, searchParams, or breakpoint change.
  const currentRawIdentifier = `${pathname}-${searchParamsString}-${breakpoint}`

  const adRefreshControl = useRef({
    lastEffectiveIdentifier: currentRawIdentifier, // Identifier for which an ad load was last permitted
    lastAdRefreshTime: 0,
    lastPath: pathname,
    lastSearchParams: searchParamsString,
    lastBreakpoint: breakpoint,
    isInitialRender: true,
  })

  // useAdRetryKey's key should change only when we *decide* to refresh the ad.
  // So, it uses `lastEffectiveIdentifier` from the ref.
  const [adKey, , , resetAdKeyAndRetries] = useAdRetryKey(
    `main-geniee-${adRefreshControl.current.lastEffectiveIdentifier}`,
    0,
  )

  const allowedBreakpoints: Breakpoint[] = ['desktop', 'desktop-large']
  // 광고 로딩은 완료되었으나, 표시할 광고가 없는 상태
  const isAdUnFilledStatus = !isAdFilled && isDoneAd
  const shouldRender = isClient && allowedBreakpoints.includes(breakpoint)

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
      refs.lastSearchParams = searchParamsString
      refs.lastBreakpoint = breakpoint
      // `currentRawIdentifier` is already set as `lastEffectiveIdentifier`
      needsAdStateReset = true
      reasonForRefresh = '🚀 Initial Ad Setup'
    } else {
      const pathChanged = refs.lastPath !== pathname
      const searchParamsChanged = refs.lastSearchParams !== searchParamsString
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
        refs.lastSearchParams = searchParamsString
        refs.lastBreakpoint = breakpoint
        needsAdStateReset = true
      }
    }

    if (needsAdStateReset) {
      console.log(
        `${reasonForRefresh} - Geniee main ad refresh triggered for identifier: ${refs.lastEffectiveIdentifier}`,
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
    console.log(`✅ Geniee main ad successfully loaded for key ${adKey}`)
    readyAdState()
  }, [readyAdState, adKey])

  const handleScriptReady = useCallback(() => {
    console.log(`🚀 Geniee script ready for main ad ${adKey}`)
    // 스크립트 준비 완료, 실제 광고 로딩은 onAdLoaded에서 처리
  }, [adKey])

  const handleAdLoaded = useCallback(
    (adId: string) => {
      if (adId === GENIEE_IDS.BANNER_ID_160x600) {
        console.log(`✅ Geniee main ad loaded: ${adId}`)
        handleAdFilled()
      }
    },
    [handleAdFilled],
  )

  if (!shouldRender) return null

  if (isDev) {
    return <div className={cn(AdStyle, 'bg-slate-300')} />
  }

  return (
    <div className={cn('relative', isAdUnFilledStatus && 'hidden')}>
      {/* Geniee SSP 스크립트 및 광고 요청 */}
      <GenieeSSP
        adIds={[GENIEE_IDS.BANNER_ID_160x600]}
        onScriptReady={handleScriptReady}
        onAdLoaded={handleAdLoaded}
      />

      {/* 광고 로딩 UI */}
      {isLoading ? (
        <Skeleton className={cn(AdStyle, 'absolute inset-0 bg-slate-300')} />
      ) : null}
      <div
        className={cn(
          'transition-opacity',
          isLoading ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <GenieeAdSlot
          key={adKey}
          adId={GENIEE_IDS.BANNER_ID_160x600}
          className={AdStyle}
        />
      </div>
    </div>
  )
}

const AdStyle =
  'my-24 h-[37.5rem] w-40 overflow-hidden rounded-sm pc:ml-5 pc:block'

const MainGeniee = () => {
  const adBlockDetected = useDetectAdBlock()

  if (adBlockDetected) {
    return null
  }

  return (
    <AdProvider>
      <MainGenieeSlot />
    </AdProvider>
  )
}

export { MainGeniee }
