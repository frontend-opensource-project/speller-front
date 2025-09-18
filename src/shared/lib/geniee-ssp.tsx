'use client'

import { useEffect } from 'react'

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

// 전역 초기화 상태 추적
let genieeInitialized = false

/**
 * HB Wrapper의 라이프사이클을 리셋하는 훅
 * registerPassback과 rerun을 실행하여 광고 시스템을 초기화
 * ⚠️ 이 훅은 앱에서 한 번만 호출되어야 합니다 (각 광고 컴포넌트가 아닌 상위 레벨에서)
 */
export const useGenieeAdClient = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (genieeInitialized) return // 이미 초기화된 경우 중복 실행 방지

    const initializeGeniee = () => {
      console.log(`initializing gnshbrequest.`)
      // 모든 광고 슬롯에 대해 registerPassback 실행
      Object.values(ads).forEach(id => {
        window.gnshbrequest.registerPassback(id)
      })
      window.gnshbrequest.rerun()
      genieeInitialized = true
    }

    // gnshbrequest 객체 초기화
    window.gnshbrequest = window.gnshbrequest || { cmd: [] }

    // 즉시 실행을 위한 타이머 추가
    const initTimer = setTimeout(() => {
      // wrapper.min.js가 이미 로드되었는지 확인 (typeof로 함수 여부 체크)
      if (typeof window.gnshbrequest.registerPassback === 'function') {
        initializeGeniee()
      } else {
        // wrapper.min.js가 아직 로드되지 않은 경우 cmd 큐에 추가
        window.gnshbrequest.cmd.push(initializeGeniee)

        // 백업 계획: 일정 시간 후 재시도
        const retryTimer = setTimeout(() => {
          if (
            !genieeInitialized &&
            typeof window.gnshbrequest.registerPassback === 'function'
          ) {
            console.log('Retrying Geniee initialization...')
            initializeGeniee()
          }
        }, 1000)

        return () => clearTimeout(retryTimer)
      }
    }, 0)

    return () => {
      clearTimeout(initTimer)
      window.gnshbrequest = window.gnshbrequest || { cmd: [] }
      window.gnshbrequest.cmd.push(() => {
        window.gnshbrequest.removeOverlay()
      })
      genieeInitialized = false
    }
  }, [])
}

/**
 * 개별 광고 슬롯에 대한 applyPassback을 실행하는 훅
 * 각 광고 컴포넌트에서 사용
 */
export const useRenderGenieeAd = (slotId: string) => {
  const passbackQuery = `[data-cptid='${slotId}']`

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.gnshbrequest = window.gnshbrequest || { cmd: [] }
    window.gnshbrequest.cmd.push(() => {
      console.log(`executing applyPassback for ${slotId}.`)
      window.gnshbrequest.applyPassback(slotId, passbackQuery)
    })
  }, [slotId, passbackQuery])
}

/**
 * 광고 슬롯 컴포넌트
 * data-cptid 속성을 가진 div 요소를 렌더링
 */
interface GenieeAdSlotProps {
  adId: string
  className?: string
  style?: React.CSSProperties
}

export const GenieeAdSlot = ({ adId, className, style }: GenieeAdSlotProps) => {
  useRenderGenieeAd(adId)

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
