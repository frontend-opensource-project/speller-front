'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { GenieeAdSlot, GENIEE_IDS, reloadAd } from '../lib/geniee-ssp'
import { useGenieeContext } from './geniee-provider'

const isDev = process.env.NODE_ENV === 'development'

// 한 화면에 맞추는 페이지에서 헤더 · 여백까지 더해 광고(600px)가 잘리지 않는 화면 높이
const COMPACT_MIN_HEIGHT_QUERY = '(min-height: 720px)'

// 화면 높이가 모자라면 광고를 잘라 보여 주지 않고 아예 그리지 않는다
const useFitsCompactAd = (compact: boolean) => {
  // 처음부터 실제 높이로 판단해야 낮은 화면에서 광고가 잠깐 그려졌다 사라지지 않는다
  const [fits, setFits] = useState(
    () =>
      typeof window === 'undefined' ||
      window.matchMedia(COMPACT_MIN_HEIGHT_QUERY).matches,
  )

  useEffect(() => {
    if (!compact) return
    const query = window.matchMedia(COMPACT_MIN_HEIGHT_QUERY)
    const update = () => setFits(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [compact])

  return !compact || fits
}

const MainGenieeSlot = ({ compact }: { compact: boolean }) => {
  const isClient = useClient()
  const breakpoint = useBreakpoint()
  const { isInitialized } = useGenieeContext()
  const pathname = usePathname()
  const isFirstMount = useRef(true)

  const allowedBreakpoints: Breakpoint[] = ['desktop', 'desktop-large']
  const fitsHeight = useFitsCompactAd(compact)
  const shouldRender =
    isClient && allowedBreakpoints.includes(breakpoint) && fitsHeight

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
    return (
      <div
        className={cn(
          AdStyle,
          compact && CompactStyle,
          'bg-slate-300 dark:bg-dark-border',
        )}
      />
    )
  }

  return (
    <div className={cn('relative')}>
      <GenieeAdSlot
        adId={GENIEE_IDS.BANNER_ID_160x600}
        isInitialized={isInitialized}
        className={cn(AdStyle, compact && CompactStyle)}
      />
    </div>
  )
}

const AdStyle = 'my-24 h-[37.5rem] w-40 pc:ml-5 pc:block'
// 한 화면에 맞추는 페이지에서는 위아래 여백을 줄인다
const CompactStyle = 'my-6'

const MainGeniee = ({ compact = false }: { compact?: boolean }) => {
  const adBlockDetected = useDetectAdBlock()

  if (adBlockDetected) {
    return null
  }

  return <MainGenieeSlot compact={compact} />
}

export { MainGeniee }
