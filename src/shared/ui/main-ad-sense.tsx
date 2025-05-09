'use client'

import GoogleAdSense from '../lib/google-ad-sense'
import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { useDesktop } from '../lib/use-desktop'

const isDev = process.env.NODE_ENV === 'development'
const NO_DELAY = 0 // 화면 크기 전환 시 지연 없이 렌더링하여, 데스크탑 전환 시 발생할 수 있는 느린 레이아웃 쉬프트 방지

const MainAdSense = () => {
  const isClient = useClient()
  const isDesktop = useDesktop(NO_DELAY)

  if (!isDesktop || !isClient) return null

  if (isDev && isDesktop) {
    return <div className={cn(AdSenseStyle, 'bg-slate-300')} />
  }

  return (
    <GoogleAdSense
      className={AdSenseStyle}
      data-ad-slot='9725653724'
      data-full-width-responsive='true'
    />
  )
}

const AdSenseStyle =
  'my-24 h-[37.5rem] w-40 place-content-center rounded-sm pc:ml-5 pc:block'

export { MainAdSense }
