'use client'

import React, {
  useRef,
  useEffect,
  useState,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import { OverlayScrollbars } from 'overlayscrollbars'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { useOptimizedScrollDetection } from '../lib/use-optimized-scroll-detection'

interface ScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  isFocused?: boolean
  onScrollStatusChange?: (isScrolling: boolean) => void
}

export interface ScrollContainerHandle {
  scrollToElement: (targetElement: HTMLElement) => void
  scrollTo: (options: ScrollToOptions) => void
  getScrollPosition: () => { x: number; y: number }
  getOsInstance: () => OverlayScrollbars | null
}

const SCROLL_VISIBILITY_DELAY = 500

const ScrollContainer = forwardRef<
  ScrollContainerHandle,
  PropsWithChildren<ScrollContainerProps>
>(({ isFocused, children, className, onScrollStatusChange, ...props }, ref) => {
  const isClient = useClient()
  /**
   * ⚠️ customScrollBarRef는 내부 컴포넌트와만 연동해야 합니다.
   * 외부 Ref에 직접 연결하면 정상 동작하지 않습니다.
   */
  const customScrollBarRef = useRef<HTMLDivElement>(null)
  const [isScrollVisible, setIsScrollVisible] = useState(false)
  const [visibility, setVisibility] = useState<'visible' | 'hidden'>('visible')

  const handleScroll = useOptimizedScrollDetection(status => {
    onScrollStatusChange?.(status)
    setIsScrollVisible(status)
  }, SCROLL_VISIBILITY_DELAY)

  const [initialize, getInstance] = useOverlayScrollbars({
    options: {
      scrollbars: {
        visibility, // 포커스 상태에 따라 스크롤바 표시/숨김
        theme: 'os-theme-custom',
        autoHide: 'never',
        dragScroll: true,
        clickScroll: 'instant',
      },
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
    },
    events: {
      scroll: handleScroll,
    },
    defer: true,
  })

  useImperativeHandle(
    ref,
    () => ({
      scrollTo: options => {
        const instance = getInstance()

        if (instance) {
          const elements = instance.elements()
          const scrollOffsetElement = elements.scrollOffsetElement

          scrollOffsetElement.scrollTo(options)
        }
      },
      scrollToElement: element => {
        const instance = getInstance()

        if (instance && element) {
          const elements = instance.elements()
          const scrollOffsetElement = elements.scrollOffsetElement
          const containerRect = scrollOffsetElement.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          const offsetTop =
            elementRect.top - containerRect.top + scrollOffsetElement.scrollTop

          scrollOffsetElement.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          })
        }
      },
      getScrollPosition: () => {
        const instance = getInstance()

        if (instance) {
          const elements = instance.elements()
          const scrollOffsetElement = elements.scrollOffsetElement

          return {
            x: scrollOffsetElement.scrollLeft,
            y: scrollOffsetElement.scrollTop,
          }
        }

        return { x: 0, y: 0 }
      },
      getOsInstance: () => getInstance(),
    }),
    [getInstance],
  )

  useEffect(() => {
    // 우선 visible 상태로 설정
    setVisibility('visible')

    // 일정 시간 후에 조건 검사
    const timer = setTimeout(() => {
      if (!isScrollVisible && !isFocused) {
        setVisibility('hidden')
      }
    }, SCROLL_VISIBILITY_DELAY)

    return () => clearTimeout(timer)
  }, [isScrollVisible, isFocused])

  useEffect(() => {
    if (!isClient || !customScrollBarRef?.current) return

    initialize(customScrollBarRef.current)
  }, [isClient, initialize])

  return (
    <div
      ref={customScrollBarRef}
      data-overlayscrollbars-initialize
      className={cn('mr-[-1.25rem] pr-[1.25rem]', className)}
      {...props}
    >
      {children}
    </div>
  )
})

ScrollContainer.displayName = 'CustomScrollContainer'

export { ScrollContainer }
