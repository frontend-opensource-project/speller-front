'use client'

import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { GenieeAdSlot, GENIEE_IDS } from '../lib/geniee-ssp'
import { useGenieeContext } from './geniee-provider'

const isDev = process.env.NODE_ENV === 'development'

const MainGenieeSlot = () => {
  const isClient = useClient()
  const breakpoint = useBreakpoint()
  const { isInitialized } = useGenieeContext()

  const allowedBreakpoints: Breakpoint[] = ['desktop', 'desktop-large']
  const shouldRender = isClient && allowedBreakpoints.includes(breakpoint)

  if (!shouldRender) return null

  if (isDev) {
    return <div className={cn(AdStyle, 'bg-slate-300')} />
  }

  return (
    <div className={cn('relative')}>
      <GenieeAdSlot
        adId={GENIEE_IDS.BANNER_ID_160x600}
        isInitialized={isInitialized}
        className={AdStyle}
      />
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
