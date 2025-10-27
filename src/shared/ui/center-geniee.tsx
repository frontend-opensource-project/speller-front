'use client'

import { useDetectAdBlock } from 'adblock-detect-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { Breakpoint, useBreakpoint } from '../lib/use-break-point'
import { GenieeAdSlot, GENIEE_IDS } from '../lib/geniee-ssp'
import { useGenieeContext } from './geniee-provider'

const isDev = process.env.NODE_ENV === 'development'

const CenterGenieeSlot = ({
  includeDevice,
}: {
  includeDevice: Breakpoint[]
}) => {
  const isClient = useClient()
  const breakpoint = useBreakpoint()
  const { isInitialized } = useGenieeContext()

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
        'relative min-h-[6.5rem] overflow-hidden rounded-sm bg-slate-100',
      )}
    >
      <div
        className={cn(
          'relative grid min-h-[6.25rem] items-center justify-items-center',
        )}
      >
        <GenieeAdSlot
          adId={GENIEE_IDS.BANNER_ID_729x90}
          isInitialized={isInitialized}
        />
      </div>
    </div>
  )
}

const CenterGeniee = ({ includeDevice }: { includeDevice: Breakpoint[] }) => {
  const adBlockDetected = useDetectAdBlock()

  if (adBlockDetected) {
    return null
  }

  return <CenterGenieeSlot includeDevice={includeDevice} />
}

export { CenterGeniee }
