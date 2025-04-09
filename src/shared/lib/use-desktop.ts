'use client'

import { useMemo } from 'react'
import { useWindowSize } from '@frontend-opensource/use-react-hooks'

import { isDesktopWidth } from './isDesktop'

const DELAY_MS = 1000 // 1초

const useDesktop = (delayTime?: number) => {
  const { width } = useWindowSize(delayTime ?? DELAY_MS)
  const targetWidth = width ?? 0
  const isDesktop = useMemo(() => isDesktopWidth(targetWidth), [targetWidth])

  return isDesktop
}

export { useDesktop }
