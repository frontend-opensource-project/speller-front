// NOTE: 현재 프로덕션에 적용된 파일입니다. 참고용이며, 이 파일에서는 모바일에서 광고가 표시되지 않는 문제가 있습니다.
// google-ad-sense.tsx에서 로직 수정 후 광고가 정상적으로 표시된다면 해당 파일은 삭제할 예정입니다.

'use client'

import { cn } from '@/shared/lib/tailwind-merge'
import React, { useEffect, useRef, useState } from 'react'
import { useDesktopByWindowSize } from './use-desktop'

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[]
  }
}

interface GoogleAdSenseProps {
  className?: string
}

const NO_DELAY = 0 // 화면 크기 전환 시 지연 없이 렌더링하여, 데스크탑 전환 시 발생할 수 있는 느린 레이아웃 쉬프트 방지

const GoogleAdSense = ({ className, ...props }: GoogleAdSenseProps) => {
  const adRef = useRef<HTMLModElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  // 데스크탑: 수동 광고 사용
  // 태블릿/모바일: 자동 광고 사용 (Google이 <ins> 태그 없이 광고 자동 삽입)
  const isDesktop = useDesktopByWindowSize(NO_DELAY)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // isMounted가 true가 된 후 (클라이언트에서 마운트 완료)
    // isDesktop이 true이고 (데스크탑 화면)
    // adRef.current가 존재할 때 (ins 태그가 렌더링 됨)
    if (isMounted && isDesktop && adRef.current) {
      // CSS가 적용되고 DOM이 안정화될 시간을 주기 위해 짧은 지연 추가
      const timerId = setTimeout(() => {
        try {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (e) {
          console.error('Error pushing ad to AdSense:', e)
        }
      }, 100) // 100ms 지연, 필요에 따라 조절 가능

      return () => clearTimeout(timerId) // 클린업 함수
    }
  }, [isMounted, isDesktop]) // isMounted와 isDesktop, 그리고 ad-slot 변경 시에도 재시도

  // 마운트 전에는 아무것도 렌더링하지 않음 (SSR 회피 및 초기 깜빡임 방지)
  if (!isMounted) {
    // console.log('AdSense: Not mounted yet');
    return null
  }

  // 데스크톱이 아니면 수동 광고를 렌더링하지 않음 (자동 광고에 위임)
  if (!isDesktop) {
    // console.log('AdSense: Not desktop, returning null for manual ad.');
    return null
  }

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
