'use client'

import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useStore } from 'react-redux'
import type { ViewportPages } from '../lib/order-pages'
import {
  sendLongBoundaryMismatchEvent,
  sendLongCheckFailedEvent,
} from '@/shared/lib/send-ga-event'
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
      onPageFailed: (pageIdx, error) =>
        sendLongCheckFailedEvent({
          pageIdx,
          errorStage: error.kind,
          errorCode: error.errorCode ?? error.httpStatus ?? 9999,
          errorMessage: error.errorMessage,
        }),
      onBoundaryMismatch: pageIdx =>
        sendLongBoundaryMismatchEvent({
          pageIdx,
          textLength: store.getState().longCheck.originalText.length,
        }),
    })
  }
  const queue = queueRef.current

  useEffect(() => {
    queue.updateViewport(viewport)
  }, [queue, viewport])

  useEffect(() => {
    queue.setScrolling(isScrolling)
  }, [queue, isScrolling])

  // 구간 컴포넌트를 memo로 두므로 함수는 매번 새로 만들지 않는다
  const actions = useMemo(
    () => ({
      requestAll: () => queue.requestAll(),
      prioritize: (pageIdx: number) => queue.prioritize(pageIdx),
      retry: (pageIdx: number) => queue.retry(pageIdx),
      resume: () => queue.resume(),
    }),
    [queue],
  )

  return {
    paused: queue.paused,
    inFlightCount: queue.inFlightCount,
    allRequested: queue.allRequested,
    consecutiveTimeouts: queue.consecutiveTimeouts,
    ...actions,
  }
}

export { useCheckQueue }
