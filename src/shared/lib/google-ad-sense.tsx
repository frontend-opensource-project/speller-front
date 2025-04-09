'use client'

import { cn } from '@/shared/lib/tailwind-merge'
import React, { useEffect, useRef, useState } from 'react'
import { useDesktop } from './use-desktop'

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[]
  }
}

interface GoogleAdSenseProps {
  className?: string
}

const DELAY_MS = 0 // 화면 크기 전환 시 지연 없이 렌더링하여, 데스크탑 전환 시 발생할 수 있는 느린 레이아웃 쉬프트 방지

const GoogleAdSense = ({ className, ...props }: GoogleAdSenseProps) => {
  const adRef = useRef<HTMLModElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  // 데스크탑: 수동 광고 사용
  // 태블릿/모바일: 자동 광고 사용 (Google이 <ins> 태그 없이 광고 자동 삽입)
  const isDesktop = useDesktop(DELAY_MS)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // 광고 DOM이 렌더된 이후에만 push 실행
    if (isDesktop && adRef.current) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error(e)
      }
    }
  }, [isDesktop])

  // 마운트 전에는 아무것도 렌더링하지 않음
  if (!isMounted) return null

  // 마운트 후 데스크톱이 아니면 렌더링하지 않음
  if (!isDesktop) return null

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
