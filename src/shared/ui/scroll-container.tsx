'use client'

import React, { useEffect, useState, PropsWithChildren } from 'react'
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentRef,
  useOverlayScrollbars,
} from 'overlayscrollbars-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { useOptimizedScrollDetection } from '../lib/use-optimized-scroll-detection'

interface ScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  isFocused?: boolean
  containerRef?: React.RefObject<OverlayScrollbarsComponentRef> | null
  onScrollStatusChange?: (isScrolling: boolean) => void
}

const ScrollContainer = ({
  isFocused,
  containerRef,
  children,
  className,
  onScrollStatusChange,
  ...props
}: PropsWithChildren<ScrollContainerProps>) => {
  const isClient = useClient()

  const [isScrollVisible, setIsScrollVisible] = useState(false)
  const [visibility, setVisibility] = useState<'visible' | 'hidden'>('visible')

  const handleScroll = useOptimizedScrollDetection(status => {
    onScrollStatusChange?.(status)
    setIsScrollVisible(status)
  }, 500)

  const [initialize] = useOverlayScrollbars({
    options: {
      paddingAbsolute: true,
      scrollbars: {
        theme: 'os-theme-custom',
        autoHide: 'never',
        visibility, // 포커스 상태에 따라 스크롤바 표시/숨김
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

  useEffect(() => {
    // 우선 visible 상태로 설정
    setVisibility('visible')

    // 일정 시간 후에 조건 검사
    const timer = setTimeout(() => {
      if (!isScrollVisible && !isFocused) {
        setVisibility('hidden')
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [isScrollVisible, isFocused])

  useEffect(() => {
    if (!isClient) return
    initialize(document.body)
  }, [isClient])

  return (
    <OverlayScrollbarsComponent
      data-overlayscrollbars-initialize
      ref={containerRef}
      className={cn(
        'mr-[-1.25rem] resize-none overflow-y-auto pr-[1.25rem] outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}

export { ScrollContainer }
