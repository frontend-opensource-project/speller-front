'use client'

import { useEffect, useState, useRef } from 'react'

import GoogleAdSense from '../lib/google-ad-sense'
import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { getBreakpoint } from '../lib/get-break-point'

type Breakpoint = ReturnType<typeof getBreakpoint>

const isDev = process.env.NODE_ENV === 'development'

const FooterAdSense = () => {
  const isClient = useClient()
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint())
  const prevBreakpointRef = useRef<Breakpoint>(breakpoint)

  useEffect(() => {
    const update = () => {
      const current = getBreakpoint()
      if (prevBreakpointRef.current !== current) {
        prevBreakpointRef.current = current
        setBreakpoint(current)
      }
    }

    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (!isClient) return null

  if (isDev) {
    return <div className={cn(AdStyle, 'bg-slate-300')} />
  }

  return (
    <GoogleAdSense
      key={`footer-ad-${breakpoint}`} // key를 사용하여 광고를 강제로 다시 로드
      className={AdStyle}
      data-ad-slot='4790060150'
      data-full-width-responsive='true'
    />
  )
}

const AdStyle =
  'mb-1 h-[90px] w-full max-w-[100vw] overflow-hidden rounded-sm tab:max-w-[728px]'

export { FooterAdSense }
