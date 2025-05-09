'use client'

import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/shared/lib/tailwind-merge'
import { useClient } from './use-client'

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[]
  }
}

interface GoogleAdSenseProps {
  className?: string
}

const AD_LOAD_TIMEOUT_MS = 5000
const AD_STATUS_ATTR = 'data-adsbygoogle-status'

const GoogleAdSense = ({ className, ...props }: GoogleAdSenseProps) => {
  const isClient = useClient()
  const adRef = useRef<HTMLModElement>(null)
  const [isAdLoaded, setIsAdLoaded] = useState(false)

  useEffect(() => {
    if (!adRef.current) return

    let didSetLoaded = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    // 이미 광고가 로드된 상태인지 확인합니다.
    const alreadyLoaded = adRef.current.getAttribute(AD_STATUS_ATTR) === 'done'

    // 광고가 한 번만 로드 완료 상태로 바뀌도록 보장하는 함수.
    const setLoadedOnce = () => {
      if (!didSetLoaded) {
        setIsAdLoaded(true)
        didSetLoaded = true
      }
    }

    if (!alreadyLoaded) {
      try {
        // 광고 스크립트를 실행시켜 광고 요청.
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})

        // MutationObserver를 사용하여 광고 DOM의 속성 변화를 감시합니다.
        // 광고가 성공적으로 로드되면 data-adsbygoogle-status="done" 속성이 추가됩니다.
        const observer = new MutationObserver(() => {
          const status = adRef.current?.getAttribute(AD_STATUS_ATTR)

          if (status === 'done') {
            setLoadedOnce() // 광고 로드 완료 시 상태 변경
            observer.disconnect()

            if (timeoutId) {
              clearTimeout(timeoutId)
            }
          }
        })

        observer.observe(adRef.current, { attributes: true })

        // 일정 시간 내에 광고가 로드되지 않으면 실패로 처리합니다.
        timeoutId = setTimeout(() => {
          const status = adRef.current?.getAttribute(AD_STATUS_ATTR)

          if (status === 'done') {
            setLoadedOnce()
          } else {
            console.warn('AdSense failed to load within timeout.')
          }

          observer.disconnect()
        }, AD_LOAD_TIMEOUT_MS)

        return () => {
          observer.disconnect()

          if (timeoutId) {
            clearTimeout(timeoutId)
          }
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      // 이미 광고가 로드된 경우 즉시 상태를 변경합니다.
      setLoadedOnce()
    }
  }, [])

  // 클라이언트가 아니거나 광고가 아직 로드되지 않은 경우 렌더링하지 않습니다.
  if (!isClient || !isAdLoaded) return null

  // 광고 클라이언트 ID가 없을 경우 경고를 남기고 렌더링하지 않습니다.
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
