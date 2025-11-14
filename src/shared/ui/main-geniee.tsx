'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { GenieeAdSlot, GENIEE_IDS, reloadAd } from '../lib/geniee-ssp'
import { useGenieeContext } from './geniee-provider'

const isDev = process.env.NODE_ENV === 'development'

const MainGenieeSlot = () => {
  const isClient = useClient()
  const breakpoint = useBreakpoint()
  const { isInitialized } = useGenieeContext()
  const pathname = usePathname()
  const isFirstMount = useRef(true)

  const allowedBreakpoints: Breakpoint[] = ['desktop', 'desktop-large']
  const shouldRender = isClient && allowedBreakpoints.includes(breakpoint)

  // pathname 변경 시 광고 재로드 (최초 마운트 제외)
  useEffect(() => {
    if (!isInitialized || !shouldRender) return

    // 최초 마운트 시에는 useRenderGenieeAd가 처리하므로 스킵
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    console.log('[MainGeniee] Pathname changed, reloading ad')
    reloadAd(GENIEE_IDS.BANNER_ID_160x600)
  }, [pathname, isInitialized, shouldRender])

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

const AdStyle = 'my-24 h-[37.5rem] w-40 pc:ml-5 pc:block'

const MainGeniee = () => {
  const adBlockDetected = useDetectAdBlock()

  if (adBlockDetected) {
    return null
  }

  return <MainGenieeSlot />
}

export { MainGeniee }
