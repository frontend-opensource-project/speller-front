'use client'

import GoogleAdSense from '../lib/google-ad-sense'
import { cn } from '../lib/tailwind-merge'

const isDev = process.env.NODE_ENV === 'development'

const FooterAdSense = () => {
  if (isDev) {
    return <div className={cn(AdSenseStyle, 'bg-slate-300')} />
  }

  return (
    <GoogleAdSense
      className={AdSenseStyle}
      data-ad-slot='4790060150'
      data-full-width-responsive='true'
    />
  )
}

const AdSenseStyle =
  'mb-1 h-[90px] w-full max-w-[100vw] overflow-hidden rounded-sm tab:max-w-[728px]'

export { FooterAdSense }
