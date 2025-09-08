'use client'

import { Suspense } from 'react'
import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { GenieeSSP, GenieeAdSlot, GENIEE_IDS } from '../lib/geniee-ssp'

const isDev = process.env.NODE_ENV === 'development'

const FooterGenieeSlot = ({
  includeDevice,
}: {
  includeDevice: Breakpoint[]
}) => {
  const isClient = useClient()
  const breakpoint = useBreakpoint()

  const shouldRender = isClient && includeDevice.includes(breakpoint)

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
        'relative max-h-[6.5rem] min-h-[6.5rem] overflow-hidden rounded-sm bg-slate-100 pc:min-h-[6.25rem] pc:w-full pc:min-w-[31.25rem] pc:bg-slate-200 pc-lg:max-w-[45.5rem]',
      )}
    >
      {/* Geniee SSP 스크립트 및 광고 요청 */}
      <GenieeSSP adIds={[GENIEE_IDS.OVERLAY_ID]} />

      {/* 오버레이 광고는 바로 표시 */}
      <div
        className={cn(
          'relative grid min-h-[6.25rem] items-center justify-items-center pc:justify-items-end',
        )}
      >
        <GenieeAdSlot
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
      <FooterGenieeSlot includeDevice={includeDevice} />
    </Suspense>
  )
}

export { FooterGeniee }
