'use client'

import { useEffect, useMemo, useState } from 'react'
import { useWindowSize } from '@frontend-opensource/use-react-hooks'
import { UAParser } from 'ua-parser-js'

import { DESKTOP } from '../../../tailwind.config'

const DELAY_MS = 1000 // 1초

const isDesktopWidth = (width: number) => width >= DESKTOP

const useDesktop = (delayTime?: number) => {
  const { width } = useWindowSize(delayTime ?? DELAY_MS)
  const targetWidth = width ?? 0
  const isDesktop = useMemo(() => isDesktopWidth(targetWidth), [targetWidth])

  return isDesktop
}

const useDesktopDevice = () => {
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const parser = new UAParser()
    const result = parser.getResult()
    setIsDesktop(!result.device.type)
  }, [])

  return isDesktop
}

export { useDesktop, useDesktopDevice }
