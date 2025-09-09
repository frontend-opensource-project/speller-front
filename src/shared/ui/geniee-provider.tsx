'use client'

import { useGenieeAdClient } from '../lib/geniee-ssp'

/**
 * Geniee 광고 시스템 초기화를 담당하는 클라이언트 컴포넌트
 * BaseLayout에서 한 번만 렌더링되어 전역 광고 시스템을 초기화합니다
 */
export const GenieeProvider = () => {
  useGenieeAdClient()
  return null
}
