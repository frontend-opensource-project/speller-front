'use client'

import React, { useEffect, useRef } from 'react'

import { cn } from '@/shared/lib/tailwind-merge'

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[]
  }
}

interface GoogleAdSenseProps {
  className?: string
}

const AD_STATUS_ATTR = 'data-adsbygoogle-status'
const AD_LOAD_INTERVAL = 100 // 100ms 간격
const MAX_ATTEMPTS = 50 // 5초간 최대 시도

const GoogleAdSense = ({ className, ...props }: GoogleAdSenseProps) => {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!adRef.current) return

    // 광고 스크립트가 로드될 때까지 polling → 준비되면 광고 push
    const timerId = tryLoadAdGoogle({
      onAdReady: () => {
        try {
          const alreadyLoaded =
            adRef.current?.getAttribute(AD_STATUS_ATTR) === 'done'

          if (!alreadyLoaded && window.adsbygoogle) {
            window.adsbygoogle.push({})
          }
        } catch (e) {
          console.error('Error pushing ad to AdSense:', e)
        }
      },
      onAdFail: () => {
        console.warn('AdSense loading failed, fallback will be rendered.')
      },
      maxAttempts: MAX_ATTEMPTS,
      retry: AD_LOAD_INTERVAL,
    })

    return () => clearInterval(timerId)
  }, [])

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

interface TryLoadAdGoogle {
  onAdReady: () => void
  onAdFail: () => void
  retry: number
  maxAttempts: number
}

// AdSense 스크립트가 준비될 때까지 polling을 수행한 뒤, push 수행
const tryLoadAdGoogle = ({
  onAdReady,
  onAdFail,
  retry,
  maxAttempts,
}: TryLoadAdGoogle): NodeJS.Timeout => {
  let attempts = 0
  // 매번 실행 시점 기준으로 광고 스크립트 준비 여부 평가
  const isAdSenseReady = () =>
    typeof window !== 'undefined' && !!window.adsbygoogle

  // 준비되지 않았을 경우 일정 간격으로 재시도
  const timerId = setInterval(() => {
    if (isAdSenseReady()) {
      onAdReady()
      clearInterval(timerId)
    }

    if (++attempts >= maxAttempts) {
      onAdFail()
      clearInterval(timerId)
    }
  }, retry)

  return timerId
}

export default GoogleAdSense
