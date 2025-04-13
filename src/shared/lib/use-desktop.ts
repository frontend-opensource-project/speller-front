'use client'

import { useMemo } from 'react'
import { useWindowSize } from '@frontend-opensource/use-react-hooks'

const DELAY_MS = 1000 // 1초
const DESKTOP_SIZE = 1377 // 데스크탑 너비

const isDesktopWidth = (width: number) => width >= DESKTOP_SIZE

const useDesktop = (delayTime?: number) => {
  const { width } = useWindowSize(delayTime ?? DELAY_MS)
  const targetWidth = width ?? 0
  const isDesktop = useMemo(() => isDesktopWidth(targetWidth), [targetWidth])

  return isDesktop
}

export { useDesktop }
