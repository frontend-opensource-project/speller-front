'use client'

import { useDetectAdBlock } from 'adblock-detect-react'

import { useClient } from '../lib/use-client'
import { useRenderGenieeInterstitial } from '../lib/geniee-ssp'
import { useGenieeContext } from './geniee-provider'

const isDev = process.env.NODE_ENV === 'development'

const InterstitialGenieeSlot = () => {
  const { isInitialized } = useGenieeContext()

  useRenderGenieeInterstitial(isInitialized)

  // 전면광고는 DOM 컨테이너를 body 에 직접 붙이므로 렌더링할 엘리먼트가 없음
  return null
}

/**
 * Geniee 전면광고(인터스티셜)
 * - 슬롯 ID 없이 동작하는 포맷이라 registerPassback / rerun 대상이 아님
 * - 첫 접속 시 1회만 송출 (사용자별 24시간 1회 제한은 광고 플랫폼에서 처리)
 * - GenieeProvider 하위에서 앱 전역에 1회만 마운트
 */
const InterstitialGeniee = () => {
  const adBlockDetected = useDetectAdBlock()
  const isClient = useClient()

  // 개발 환경에서는 화면 전체를 덮으므로 송출하지 않음
  if (isDev || !isClient || adBlockDetected) {
    return null
  }

  return <InterstitialGenieeSlot />
}

export { InterstitialGeniee }
