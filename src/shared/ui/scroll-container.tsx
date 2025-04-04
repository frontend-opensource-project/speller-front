'use client'

import React, {
  useRef,
  useEffect,
  useState,
  FC,
  PropsWithChildren,
} from 'react'
import { useOverlayScrollbars } from 'overlayscrollbars-react'

import { cn } from '../lib/tailwind-merge'
import { useClient } from '../lib/use-client'
import { useOptimizedScrollDetection } from '../lib/use-optimized-scroll-detection'

interface ScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  isFocused?: boolean
  containerRef?: React.RefObject<HTMLDivElement> | null
  onScrollStatusChange?: (isScrolling: boolean) => void
}

const ScrollContainer: FC<PropsWithChildren<ScrollContainerProps>> = ({
  isFocused,
  containerRef,
  children,
  className,
  onScrollStatusChange,
  ...props
}) => {
  const isClient = useClient()

  const [isScrollVisible, setIsScrollVisible] = useState(false)
  const [visibility, setVisibility] = useState<'visible' | 'hidden'>('visible')
  // 스크롤바를 적용할 최상위 div 요소 참조
  const divRef = useRef<HTMLDivElement>(null)
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
        // 포커스 상태에 따라 스크롤바 표시/숨김
        visibility: visibility,
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
    if (!isClient || !divRef?.current) return
    initialize(divRef.current)
  }, [isClient, initialize])

  return (
    <div
      ref={divRef}
      data-overlayscrollbars-initialize
      className={cn(
        'mr-[-1.25rem] resize-none overflow-y-auto pr-[1.25rem] outline-none',
        className,
      )}
      {...props}
    >
      <div ref={containerRef} className='h-full overflow-y-auto'>
        {children}
      </div>
    </div>
  )
}

export { ScrollContainer }
