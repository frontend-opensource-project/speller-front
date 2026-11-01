'use client'

import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import {
  EMPTY_VIEWPORT,
  getViewportPages,
  type PageRect,
  type ViewportPages,
} from '../lib/order-pages'

// scroll 이벤트가 이 시간 동안 없으면 멈춘 것으로 본다. 테스트 서버에서 조정한다
const SCROLL_STOP_MS = 150

// 구간 요소에는 data-page-idx 속성을 붙인다
const PAGE_SELECTOR = '[data-page-idx]'

const measure = (container: HTMLElement): ViewportPages => {
  const containerTop = container.getBoundingClientRect().top
  const rects: PageRect[] = []
  container.querySelectorAll<HTMLElement>(PAGE_SELECTOR).forEach(el => {
    const rect = el.getBoundingClientRect()
    const top = rect.top - containerTop + container.scrollTop
    rects.push({
      pageIdx: Number(el.dataset.pageIdx),
      top,
      bottom: top + rect.height,
    })
  })
  rects.sort((a, b) => a.top - b.top)
  return getViewportPages(
    rects,
    container.scrollTop,
    container.scrollTop + container.clientHeight,
  )
}

/**
 * 스크롤 컨테이너 안의 구간이 화면과 어떤 관계인지 스크롤이 멈출 때마다 계산한다.
 * `scrollend`를 지원하는 브라우저에서는 그것을 먼저 쓰고, 150ms 타이머를 함께 둔다.
 */
const useVisiblePages = (
  containerRef: RefObject<HTMLElement | null>,
  pageCount: number,
) => {
  const [viewport, setViewport] = useState<ViewportPages>(EMPTY_VIEWPORT)
  const [isScrolling, setIsScrolling] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const update = useCallback(() => {
    const container = containerRef.current
    if (container) setViewport(measure(container))
  }, [containerRef])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const stop = () => {
      clearTimeout(timerRef.current)
      setIsScrolling(false)
      update()
    }
    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(stop, SCROLL_STOP_MS)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('scrollend', stop)
    // 창 크기가 바뀌면 한 화면 높이와 구간 높이가 달라진다
    const resizeObserver = new ResizeObserver(() => update())
    resizeObserver.observe(container)

    return () => {
      clearTimeout(timerRef.current)
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('scrollend', stop)
      resizeObserver.disconnect()
    }
  }, [containerRef, update])

  // 처음 그려졌을 때와 구간 수가 바뀌었을 때(차례 요청) 다시 잰다
  useEffect(() => {
    update()
  }, [update, pageCount])

  return { viewport, isScrolling }
}

export { useVisiblePages, SCROLL_STOP_MS }
