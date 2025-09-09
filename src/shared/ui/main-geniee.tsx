'use client'

import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { useGenieeAdClient, GenieeAdSlot, GENIEE_IDS } from '../lib/geniee-ssp'

const isDev = process.env.NODE_ENV === 'development'

const MainGenieeSlot = () => {
  const isClient = useClient()
  const breakpoint = useBreakpoint()

  const allowedBreakpoints: Breakpoint[] = ['desktop', 'desktop-large']
  const shouldRender = isClient && allowedBreakpoints.includes(breakpoint)

  if (!shouldRender) return null

  if (isDev) {
    return <div className={cn(AdStyle, 'bg-slate-300')} />
  }

  return (
    <div className={cn('relative')}>
      <GenieeAdSlot adId={GENIEE_IDS.BANNER_ID_160x600} className={AdStyle} />
    </div>
  )
}

const AdStyle =
  'my-24 h-[37.5rem] w-40 overflow-hidden rounded-sm pc:ml-5 pc:block'

const MainGeniee = () => {
  const adBlockDetected = useDetectAdBlock()

  // Geniee 광고 클라이언트 초기화
  useGenieeAdClient()

  if (adBlockDetected) {
    return null
  }

  return <MainGenieeSlot />
}

export { MainGeniee }
