'use client'

import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { GenieeSSP, GenieeAdSlot, GENIEE_IDS } from '../lib/geniee-ssp'

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
      {/* Geniee SSP 스크립트 및 광고 요청 */}
      <GenieeSSP adIds={[GENIEE_IDS.BANNER_ID_160x600]} />
      <GenieeAdSlot adId={GENIEE_IDS.BANNER_ID_160x600} className={AdStyle} />
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

  return <MainGenieeSlot />
}

export { MainGeniee }
