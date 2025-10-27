'use client'

import { useEffect, useRef, useState } from 'react'

// Geniee SSP 광고 ID 상수 (guide에서 제공된 ads.ts 패턴 따름)
export const ads = {
  overlay: '1597526_nara-speller.co.kr_overlay',
  banner160x600: '1597525_nara-speller.co.kr_standardbanner_160x600',
  banner729x90: '1598714_nara-speller.co.kr_standardbanner_729x90',
} as const

// 기존 GENIEE_IDS 호환성 유지
export const GENIEE_IDS = {
  OVERLAY_ID: ads.overlay,
  BANNER_ID_160x600: ads.banner160x600,
  BANNER_ID_729x90: ads.banner729x90,
} as const

declare global {
  interface Window {
    gnshbrequest: {
      cmd: Array<() => void>
      registerPassback: (id: string) => void
      rerun: () => void
      applyPassback: (id: string, selector: string) => void
      forceInternalRequest: () => void
      preventFirstRun: () => void
      removeOverlay: () => void
    }
  }
}

// ✅ 전역 상태: 현재 활성화된 광고 슬롯 ID 추적
let currentActiveSlots = new Set<string>()
let initPromise: Promise<void> | null = null

/**
 * ✅ registerPassback + rerun을 실행하는 Promise 반환
 * @param slots - 초기화할 광고 슬롯 ID 배열
 */
const initializeGenieeSlots = (slots: string[]): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'))
      return
    }

    const performInit = () => {
      try {
        console.log(`[Geniee] Initializing slots: ${slots.join(', ')}`)

        // ① removeOverlay 실행 (가장 먼저)
        window.gnshbrequest.removeOverlay()

        // ② registerPassback 실행
        slots.forEach(id => {
          window.gnshbrequest.registerPassback(id)
        })

        // ③ rerun 실행
        window.gnshbrequest.rerun()

        console.log('[Geniee] Initialization completed.')
        resolve()
      } catch (error) {
        console.error('[Geniee] Initialization failed:', error)
        reject(error)
      }
    }

    window.gnshbrequest = window.gnshbrequest || { cmd: [] }

    if (typeof window.gnshbrequest.registerPassback === 'function') {
      performInit()
    } else {
      window.gnshbrequest.cmd.push(performInit)

      // 백업: 5초 타임아웃
      setTimeout(() => {
        if (typeof window.gnshbrequest.registerPassback === 'function') {
          console.log('[Geniee] Retrying initialization...')
          performInit()
        } else {
          reject(new Error('Geniee wrapper not loaded'))
        }
      }, 5000)
    }
  })
}

/**
 * ✅ HB Wrapper 최초 초기화 훅 (앱에서 한 번만 실행)
 */
export const useGenieeAdClient = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const initStartedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (initStartedRef.current) return

    initStartedRef.current = true

    // 최초 로드 시 모든 광고 슬롯 초기화
    const allSlots = Object.values(ads)
    currentActiveSlots = new Set(allSlots)

    initPromise = initializeGenieeSlots(allSlots)
    initPromise
      .then(() => {
        console.log(
          '[Geniee] Initialization successful, setting isInitialized to true',
        )
        setIsInitialized(true)
      })
      .catch(error => {
        console.error('[Geniee] Failed to initialize:', error)
        setIsInitialized(false)
      })

    return () => {
      window.gnshbrequest = window.gnshbrequest || { cmd: [] }
      window.gnshbrequest.cmd.push(() => {
        window.gnshbrequest.removeOverlay()
      })
    }
  }, [])

  return { isInitialized }
}

/**
 * ✅ 개별 광고 슬롯 렌더링 훅
 * - 슬롯이 처음 마운트되거나 이전과 다른 슬롯일 경우 재초기화
 * - isInitialized가 true가 될 때까지 대기
 */
export const useRenderGenieeAd = (slotId: string, isInitialized: boolean) => {
  const processedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isInitialized) {
      console.log(
        `[Geniee] Waiting for initialization before rendering ${slotId}`,
      )
      return
    }
    if (processedRef.current) return

    const passbackQuery = `[data-cptid='${slotId}']`

    const renderAd = async () => {
      try {
        // ③-1 현재 활성 슬롯에 없는 경우 재초기화 필요
        if (!currentActiveSlots.has(slotId)) {
          console.log(
            `[Geniee] New slot detected: ${slotId}. Re-initializing...`,
          )

          // 모든 슬롯 재등록 (Geniee 요구사항)
          const allSlots = Object.values(ads)
          currentActiveSlots = new Set(allSlots)

          // 기존 Promise 무효화 후 재초기화
          initPromise = initializeGenieeSlots(allSlots)
          await initPromise
        } else {
          // 이미 초기화된 경우 Promise 대기
          if (initPromise) {
            await initPromise
          }
        }

        // ③-2 applyPassback 실행
        window.gnshbrequest = window.gnshbrequest || { cmd: [] }
        window.gnshbrequest.cmd.push(() => {
          console.log(`[Geniee] Executing applyPassback for ${slotId}.`)
          window.gnshbrequest.applyPassback(slotId, passbackQuery)
          processedRef.current = true
        })
      } catch (error) {
        console.error(`[Geniee] Failed to apply passback for ${slotId}:`, error)
      }
    }

    renderAd()
  }, [slotId, isInitialized])
}

/**
 * 특정 광고 슬롯을 재로드하는 함수
 * 사용자 액션 후 광고를 새로고침할 때 사용
 */
export const reloadAd = (slotId: string) => {
  if (typeof window === 'undefined') {
    console.warn('[Geniee] Cannot reload ad on server side')
    return
  }

  window.gnshbrequest = window.gnshbrequest || { cmd: [] }
  window.gnshbrequest.cmd.push(() => {
    console.log(`[Geniee] Reloading ad: ${slotId}`)

    // 슬롯 재등록
    window.gnshbrequest.registerPassback(slotId)
    window.gnshbrequest.rerun()

    // 재렌더링
    const selector = `[data-cptid='${slotId}']`
    window.gnshbrequest.applyPassback(slotId, selector)
  })
}

/**
 * 모든 광고 슬롯을 재로드하는 함수
 */
export const reloadAllAds = () => {
  if (typeof window === 'undefined') {
    console.warn('[Geniee] Cannot reload ads on server side')
    return
  }

  const allSlots = Object.values(ads)
  console.log('[Geniee] Reloading all ads:', allSlots)

  window.gnshbrequest = window.gnshbrequest || { cmd: [] }
  window.gnshbrequest.cmd.push(() => {
    // 모든 슬롯 재등록
    allSlots.forEach(slotId => {
      window.gnshbrequest.registerPassback(slotId)
    })

    window.gnshbrequest.rerun()

    // 모든 슬롯 재렌더링
    allSlots.forEach(slotId => {
      const selector = `[data-cptid='${slotId}']`
      window.gnshbrequest.applyPassback(slotId, selector)
    })
  })
}

/**
 * 광고 슬롯 컴포넌트
 * data-cptid 속성을 가진 div 요소를 렌더링
 */
interface GenieeAdSlotProps {
  adId: string
  isInitialized: boolean
  className?: string
  style?: React.CSSProperties
}

export const GenieeAdSlot = ({
  adId,
  isInitialized,
  className,
  style,
}: GenieeAdSlotProps) => {
  useRenderGenieeAd(adId, isInitialized)

  return (
    <div
      data-cptid={adId}
      className={className}
      style={{ display: 'block', ...style }}
    />
  )
}

// 기존 GenieeSSP 컴포넌트는 호환성을 위해 유지하지만 사용하지 않음
export const GenieeSSP = () => {
  console.warn(
    'GenieeSSP is deprecated. Use useGenieeAdClient and GenieeAdSlot instead.',
  )
  return null
}
