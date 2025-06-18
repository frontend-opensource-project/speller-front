'use client'

import { useDesktopByWindowSize } from '@/shared/lib/use-desktop'
import { useMemo } from 'react'

/**
 * 데스크탑 여부에 따라 지정된 값을 반환하는 훅
 * @param desktopValue 데스크탑일 경우 반환할 값
 * @param fallbackValue 아닐 경우 반환할 값
 */
const useDesktopOrFallback = <T>(desktopValue: T, fallbackValue: T): T => {
  const isDesktop = useDesktopByWindowSize()
  const result = useMemo(() => {
    return isDesktop ? desktopValue : fallbackValue
  }, [isDesktop, desktopValue, fallbackValue])

  return result
}

export { useDesktopOrFallback }
