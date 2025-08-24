'use client'

import { useCallback } from 'react'
import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { AdProvider, useAdContext } from '../model/ad-context'
import { Skeleton } from './skeleton'
import { GenieeSSP, GenieeAdSlot, GENIEE_IDS } from '../lib/geniee-ssp'

const isDev = process.env.NODE_ENV === 'development'

const MainGenieeSlot = () => {
  const {
    adState: { isLoading },
    readyAdState,
  } = useAdContext()
  const isClient = useClient()
  const breakpoint = useBreakpoint()

  const allowedBreakpoints: Breakpoint[] = ['desktop', 'desktop-large']
  const shouldRender = isClient && allowedBreakpoints.includes(breakpoint)

  const handleAdLoaded = useCallback(
    (adId: string) => {
      if (adId === GENIEE_IDS.BANNER_ID_160x600) {
        console.log(`✅ Geniee main ad loaded: ${adId}`)
        readyAdState()
      }
    },
    [readyAdState],
  )

  if (!shouldRender) return null

  if (isDev) {
    return <div className={cn(AdStyle, 'bg-slate-300')} />
  }

  return (
    <div className={cn('relative')}>
      {/* Geniee SSP 스크립트 및 광고 요청 */}
      <GenieeSSP
        adIds={[GENIEE_IDS.BANNER_ID_160x600]}
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
        <GenieeAdSlot adId={GENIEE_IDS.BANNER_ID_160x600} className={AdStyle} />
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
