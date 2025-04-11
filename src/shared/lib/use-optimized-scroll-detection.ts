'use client'

import {
  useDebounce,
  useUnmountEffect,
} from '@frontend-opensource/use-react-hooks'
import { useCallback, useRef } from 'react'

const useOptimizedScrollDetection = (
  callback: (isScrolling: boolean) => void,
  ms: number,
) => {
  const scrollingRef = useRef(false)
  const rafRef = useRef<number>()

  // 스크롤 종료 감지를 위한 디바운스 함수
  const debouncedEndScroll = useDebounce(() => {
    scrollingRef.current = false
    callback(false)
  }, ms)

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!scrollingRef.current) {
        scrollingRef.current = true
        callback(true)
      }

      // 디바운스 함수 호출
      debouncedEndScroll()
    })
  }, [callback, debouncedEndScroll])

  useUnmountEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
  })

  return handleScroll
}

export { useOptimizedScrollDetection }
