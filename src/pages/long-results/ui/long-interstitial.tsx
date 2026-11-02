'use client'

import { useDetectAdBlock } from 'adblock-detect-react'
import {
  LONG_MODE_INTERSTITIAL_ID,
  useRenderGenieeInterstitial,
} from '@/shared/lib/geniee-ssp'
import { useGenieeContext } from '@/shared/ui/geniee-provider'

const isDev = process.env.NODE_ENV === 'development'

const LongInterstitialSlot = () => {
  const { isInitialized } = useGenieeContext()
  useRenderGenieeInterstitial(isInitialized, LONG_MODE_INTERSTITIAL_ID)
  // 컨테이너는 훅이 body에 직접 붙인다
  return null
}

/**
 * 긴글 모드 전면광고. 새 검사로 들어올 때만 그린다(부모가 결정).
 * 개발 환경에서는 화면을 덮으므로 송출하지 않는다.
 */
const LongInterstitial = () => {
  const adBlockDetected = useDetectAdBlock()
  if (isDev || adBlockDetected) return null
  return <LongInterstitialSlot />
}

export { LongInterstitial }
