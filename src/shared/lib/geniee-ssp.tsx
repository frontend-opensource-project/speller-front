'use client'

import { useEffect } from 'react'

// Geniee SSP 광고 ID 상수
export const GENIEE_IDS = {
  OVERLAY_ID: '1597526_nara-speller.co.kr_overlay',
  BANNER_ID_160x600: '1597525_nara-speller.co.kr_standardbanner_160x600',
  BANNER_ID_729x90: '1598714_nara-speller.co.kr_standardbanner_729x90',
} as const

const SCRIPT_URL = 'https://cpt.geniee.jp/hb/v1/223680/3011/wrapper.min.js'

declare global {
  interface Window {
    gnshbrequest: {
      cmd: Array<() => void>
      applyPassback: (id: string, selector: string) => void
      forceInternalRequest: () => void
    }
  }
}

interface GenieeSSPProps {
  adIds: string[]
  onScriptReady?: () => void
  onAdLoaded?: (adId: string) => void
}

export const GenieeSSP = ({
  adIds,
  onScriptReady,
  onAdLoaded,
}: GenieeSSPProps) => {
  useEffect(() => {
    const win = window as Window
    win.gnshbrequest = win.gnshbrequest || { cmd: [] }

    // 스크립트가 이미 로드되었는지 확인하고, 없으면 한 번만 로드
    const scriptExists = Array.from(
      document.getElementsByTagName('script'),
    ).some(script => script.src === SCRIPT_URL)

    if (!scriptExists) {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => {
        onScriptReady?.()
      }
      document.body.appendChild(script)
    } else {
      onScriptReady?.()
    }

    // 각 광고 슬롯에 대한 요청을 큐에 추가
    adIds.forEach(adId => {
      win.gnshbrequest.cmd.push(() => {
        win.gnshbrequest.forceInternalRequest()
        win.gnshbrequest.applyPassback(adId, `[data-cptid='${adId}']`)

        // 광고 로딩 완료 체크
        if (onAdLoaded) {
          const checkAdLoaded = () => {
            const adElement = document.querySelector(`[data-cptid='${adId}']`)
            if (adElement && adElement.children.length > 0) {
              onAdLoaded(adId)
            } else {
              setTimeout(checkAdLoaded, 500) // 0.5초마다 체크
            }
          }
          setTimeout(checkAdLoaded, 1000) // 1초 후 체크 시작
        }
      })
    })
  }, [adIds, onScriptReady, onAdLoaded])

  return null
}

interface GenieeAdSlotProps {
  adId: string
  className?: string
  style?: React.CSSProperties
}

export const GenieeAdSlot = ({ adId, className, style }: GenieeAdSlotProps) => {
  return (
    <div
      data-cptid={adId}
      className={className}
      style={{ display: 'block', ...style }}
    />
  )
}
