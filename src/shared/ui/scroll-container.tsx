'use client'

import React, {
  useRef,
  useEffect,
  useState,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  Fragment,
} from 'react'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import { OverlayScrollbars } from 'overlayscrollbars'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { useOptimizedScrollDetection } from '../lib/use-optimized-scroll-detection'

interface ScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  renderGradient?: (isScrolling: boolean) => React.ReactNode
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
>(
  (
    { children, className, onScrollStatusChange, renderGradient, ...props },
    ref,
  ) => {
    const isClient = useClient()
    /**
     * ⚠️ customScrollBarRef는 내부 컴포넌트와만 연동해야 합니다.
     * 외부 Ref에 직접 연결하면 정상 동작하지 않습니다.
     */
    const customScrollBarRef = useRef<HTMLDivElement>(null)
    const [isScrollVisible, setIsScrollVisible] = useState(false)

    const handleScroll = useOptimizedScrollDetection(status => {
      onScrollStatusChange?.(status)
      setIsScrollVisible(status)
    }, SCROLL_VISIBILITY_DELAY)

    const [initialize, getInstance] = useOverlayScrollbars({
      options: {
        scrollbars: {
          visibility: 'visible',
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
              elementRect.top -
              containerRect.top +
              scrollOffsetElement.scrollTop

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
      if (!isClient || !customScrollBarRef?.current) return

      initialize(customScrollBarRef.current)
    }, [isClient, initialize])

    return (
      <Fragment>
        <div
          ref={customScrollBarRef}
          data-overlayscrollbars-initialize
          className={cn('mr-[-1.25rem] pr-[1.25rem]', className)}
          {...props}
        >
          {children}
        </div>
        {renderGradient?.(isScrollVisible)}
      </Fragment>
    )
  },
)

ScrollContainer.displayName = 'CustomScrollContainer'

export { ScrollContainer }
