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
  onAdFilled?: () => void
  onAdUnfilled?: () => void
}

// 광고 로딩 및 상태 감지 관련 상수 설정
const AD_CONFIG = {
  loadInterval: 100, // adsbygoogle 스크립트 polling 간격 (ms)
  maxAttempts: 50, // adsbygoogle 스크립트 polling 최대 시도 횟수 (100ms * 50 = 최대 5초까지 기다림)
  viewTrigger: 0.1, // 광고 요소가 뷰포트에 10% 이상 노출되어야 로딩 시작
  status: {
    key: 'data-ad-status', // 광고 로딩 결과가 표시되는 DOM 속성
    filled: 'filled', // 광고가 정상적으로 채워진 경우의 값
    unFilled: 'unfilled', // 광고가 채워지지 못한 경우의 값
    checkIntervalMs: 200, // 광고가 삽입된 이후, 상태를 200ms 간격으로 확인
    maxCheckAttempts: 10, // 200ms * 10 = 최대 2초 동안 광고 상태 polling
  },
}

const GoogleAdSense = ({
  className,
  onAdFilled,
  onAdUnfilled,
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

              // 광고 상태를 polling하여 filled/unfilled 여부 판단
              checkAdStatusTimerRef.current = checkAdStatusPolling({
                targetElement: adRef.current,
                onAdFilled,
                onAdUnfilled,
                checkIntervalMs: AD_CONFIG.status.checkIntervalMs,
                maxCheckAttempts: AD_CONFIG.status.maxCheckAttempts,
              })
            } catch (e) {
              console.error('Error pushing ad to AdSense:', e)
              onAdUnfilled?.()
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
      clearInterval(checkAdStatusTimerRef.current)
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
      className={cn('adsbygoogle block', className)}
      data-ad-client={process.env.NEXT_PUBLIC_AD_CLIENT}
      {...restProps}
    />
  )
}

interface CheckAdStatusPolling {
  targetElement: HTMLElement | null
  onAdFilled?: () => void
  onAdUnfilled?: () => void
  checkIntervalMs: number
  maxCheckAttempts: number
}

// 광고 상태(filled/unfilled)를 polling 방식으로 확인
const checkAdStatusPolling = ({
  targetElement,
  onAdFilled,
  onAdUnfilled,
  checkIntervalMs,
  maxCheckAttempts,
}: CheckAdStatusPolling): NodeJS.Timeout => {
  let checks = 0
  let resolved = false // 중복 호출 방지를 위한 플래그

  const timer = setInterval(() => {
    if (resolved) {
      clearInterval(timer)
      return
    }

    const status = targetElement?.getAttribute(AD_CONFIG.status.key)

    if (status === AD_CONFIG.status.filled) {
      resolved = true
      clearInterval(timer)
      onAdFilled?.()
      return
    }

    if (status === AD_CONFIG.status.unFilled) {
      resolved = true
      clearInterval(timer)
      onAdUnfilled?.()
      return
    }

    if (++checks >= maxCheckAttempts) {
      resolved = true
      clearInterval(timer)
      onAdUnfilled?.()
    }
  }, checkIntervalMs)

  return timer
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
