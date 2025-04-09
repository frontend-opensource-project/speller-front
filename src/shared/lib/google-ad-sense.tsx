'use client'

import { useDeviceUtils } from '@/shared/lib/use-device-utils'
import { cn } from '@/shared/lib/tailwind-merge'
import React, { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[]
  }
}

interface GoogleAdSenseProps {
  className?: string
}
const GoogleAdSense = ({ className, ...props }: GoogleAdSenseProps) => {
  const adRef = useRef<HTMLModElement>(null)

  // 데스크탑: 수동 광고 사용
  // 태블릿/모바일: 자동 광고 사용 (Google이 <ins> 태그 없이 광고 자동 삽입)
  const { isDesktop } = useDeviceUtils()
  const [isDesktopView, setIsDesktopView] = useState(false)

  useEffect(() => {
    setIsDesktopView(isDesktop)
  }, [isDesktop])

  useEffect(() => {
    // 광고 DOM이 렌더된 이후에만 push 실행
    if (isDesktopView && adRef.current) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error(e)
      }
    }
  }, [isDesktopView])

  if (!isDesktopView) return null

  if (!process.env.NEXT_PUBLIC_AD_CLIENT) {
    console.error('AdSense client ID is missing.')
    return null
  }

  return (
    <ins
      ref={adRef}
      className={cn('adsbygoogle', 'block', className)}
      data-ad-client={process.env.NEXT_PUBLIC_AD_CLIENT}
      {...props}
    />
  )
}

export default GoogleAdSense
