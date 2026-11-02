'use client'

import { useCallback, useEffect, useRef } from 'react'
import { GENIEE_IDS, reloadAd } from '@/shared/lib/geniee-ssp'

// 이전 갱신(진입 때 첫 표시 포함)에서 이만큼 지나야 다시 갱신한다
const MIN_INTERVAL_MS = 5000

const BANNER_ID = GENIEE_IDS.BANNER_ID_160x600

/**
 * 긴글 화면의 오른쪽 배너(160x600) 갱신.
 * 배너는 주소가 바뀔 때만 갱신되고 슬롯 자동 갱신도 꺼져 있어, 긴글 화면에 머무는 동안에는 바뀌지 않는다.
 * 그래서 문서를 옮겨(스크롤 · 오류 이동) 새 구간 검사를 보냈을 때 갱신한다.
 *
 * @returns 구간 검사 요청을 보낼 때 부르는 함수
 */
const useBannerRefresh = (isScrolling: boolean) => {
  const lastRefreshRef = useRef(0)
  const movedRef = useRef(false) // 마지막 갱신 판단 뒤 문서를 옮겼는지

  // 들어올 때 배너가 처음 그려지므로 그때를 첫 갱신으로 본다
  useEffect(() => {
    lastRefreshRef.current = Date.now()
  }, [])

  useEffect(() => {
    if (isScrolling) movedRef.current = true
  }, [isScrolling])

  return useCallback(() => {
    // 한 번 옮긴 뒤 나가는 요청 여러 개는 한 번으로 본다
    if (!movedRef.current) return
    movedRef.current = false

    const now = Date.now()
    if (now - lastRefreshRef.current < MIN_INTERVAL_MS) return
    // 광고 차단 · 낮은 화면 · 개발 환경에서는 배너 자리가 없다
    if (!document.querySelector(`[data-cptid='${BANNER_ID}']`)) return

    lastRefreshRef.current = now
    reloadAd(BANNER_ID)
  }, [])
}

export { useBannerRefresh }
