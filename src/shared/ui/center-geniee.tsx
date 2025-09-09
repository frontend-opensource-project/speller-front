'use client'

import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { useGenieeAdClient, GenieeAdSlot, GENIEE_IDS } from '../lib/geniee-ssp'

const isDev = process.env.NODE_ENV === 'development'

const CenterGenieeSlot = ({
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
      <div
        className={cn(
          'relative grid min-h-[6.25rem] items-center justify-items-center pc:justify-items-end',
        )}
      >
        <GenieeAdSlot
          adId={GENIEE_IDS.BANNER_ID_729x90}
          className={cn(
            'h-full max-h-[6.25rem] w-full max-w-[29rem] overflow-hidden rounded-sm tab:max-w-[38rem] pc-lg:max-w-[45.5rem]',
          )}
        />
      </div>
    </div>
  )
}

const CenterGeniee = ({ includeDevice }: { includeDevice: Breakpoint[] }) => {
  const adBlockDetected = useDetectAdBlock()

  // Geniee 광고 클라이언트 초기화
  useGenieeAdClient()

  if (adBlockDetected) {
    return null
  }

  return <CenterGenieeSlot includeDevice={includeDevice} />
}

export { CenterGeniee }
