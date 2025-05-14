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
  onFilled?: () => void
  onUnFilled?: () => void
}

const AD_CONFIG = {
  loadInterval: 100, // adsbygoogle 스크립트 polling 간격 (ms)
  maxAttempts: 50, // polling 최대 시도 횟수 (약 5초 동안)
  viewTrigger: 0.1, // 광고 요소가 뷰포트에 10% 이상 노출됐을 때만 로딩
  status: {
    key: 'data-ad-status',
    filled: 'filled', // 광고가 성공적으로 채워진 경우
    unFilled: 'unfilled', // 광고가 로드되지 않은 경우
    detectTime: 1500, // push 이후 광고 로드 상태 감지까지 대기 시간 (ms)
  },
}

const GoogleAdSense = ({
  className,
  onFilled,
  onUnFilled,
  ...restProps
}: GoogleAdSenseProps) => {
  const initializedRef = useRef(false) // 광고가 이미 push 되었는지 추적
  const adRef = useRef<HTMLModElement>(null)
  const tryLoadAdGoogleTimerRef = useRef<NodeJS.Timeout>()
  const checkAdStatusTimerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!adRef.current || initializedRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 뷰포트에 요소가 충분히 들어오지 않았거나 이미 로드된 경우 무시
        if (!entry.isIntersecting || initializedRef.current) return

        // 광고 스크립트가 로드될 때까지 polling → 준비되면 광고 push
        tryLoadAdGoogleTimerRef.current = tryLoadAdGoogle({
          onAdReady: () => {
            try {
              // 광고 요청: <ins> 요소에 광고 삽입 시도
              ;(window.adsbygoogle = window.adsbygoogle || []).push({})
              initializedRef.current = true

              // 일정 시간 뒤 광고 로드 여부를 체크하여 콜백 호출
              checkAdStatusTimerRef.current = setTimeout(() => {
                const status = adRef.current?.getAttribute(AD_CONFIG.status.key)
                checkAdStatus(status, { onUnFilled, onFilled })
              }, AD_CONFIG.status.detectTime)
            } catch (e) {
              console.error('Error pushing ad to AdSense:', e)
              onUnFilled?.()
            }
          },
          onAdFail: () => {
            console.warn('AdSense loading failed.')
          },
          maxAttempts: AD_CONFIG.maxAttempts,
          retry: AD_CONFIG.loadInterval,
        })

        // 한 번 감지되면 observer 해제 (1회 감지 목적)
        observer.disconnect()
      },
      { threshold: AD_CONFIG.viewTrigger },
    )

    observer.observe(adRef.current)

    return () => {
      observer.disconnect()
      clearTimeout(checkAdStatusTimerRef.current)
      clearInterval(tryLoadAdGoogleTimerRef.current)
    }
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
      {...restProps}
    />
  )
}

// 광고 로딩 결과 상태 체크 함수
const checkAdStatus = (
  status: string | null | undefined,
  options: {
    onFilled?: () => void
    onUnFilled?: () => void
  },
) => {
  if (status === AD_CONFIG.status.filled) {
    return options.onFilled?.()
  }

  // filled가 아니거나 unknown일 경우에는 unfilled로 처리
  return options.onUnFilled?.()
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
