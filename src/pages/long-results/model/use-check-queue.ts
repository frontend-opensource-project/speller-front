'use client'

import { useEffect, useReducer, useRef } from 'react'
import { useStore } from 'react-redux'
import type { ViewportPages } from '../lib/order-pages'
import { CheckQueue } from './check-queue'

interface UseCheckQueueParams {
  viewport: ViewportPages // 스크롤이 멈춘 순간의 화면 범위 (use-visible-pages)
  isScrolling: boolean
}

/**
 * 긴글 모드 구간 검사 대기열을 화면에 연결한다.
 * 화면 범위가 바뀔 때마다 순서를 다시 짜고, 스크롤 중에는 새 요청을 보류한다.
 */
const useCheckQueue = ({ viewport, isScrolling }: UseCheckQueueParams) => {
  const store = useStore<RootState>()
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const queueRef = useRef<CheckQueue | null>(null)

  if (!queueRef.current) {
    queueRef.current = new CheckQueue({
      getState: () => store.getState().longCheck,
      dispatch: store.dispatch,
      onChange: rerender,
    })
  }
  const queue = queueRef.current

  useEffect(() => {
    queue.updateViewport(viewport)
  }, [queue, viewport])

  useEffect(() => {
    queue.setScrolling(isScrolling)
  }, [queue, isScrolling])

  return {
    paused: queue.paused,
    inFlightCount: queue.inFlightCount,
    allRequested: queue.allRequested,
    consecutiveTimeouts: queue.consecutiveTimeouts,
    requestAll: () => queue.requestAll(),
    prioritize: (pageIdx: number) => queue.prioritize(pageIdx),
    retry: (pageIdx: number) => queue.retry(pageIdx),
    resume: () => queue.resume(),
  }
}

export { useCheckQueue }
