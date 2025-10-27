'use client'

import { createContext, useContext, ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useGenieeAdClient, reloadAllAds } from '../lib/geniee-ssp'

interface GenieeContextType {
  isInitialized: boolean
}

const GenieeContext = createContext<GenieeContextType | null>(null)

/**
 * Geniee 광고 시스템 초기화를 담당하는 클라이언트 컴포넌트
 * Context를 통해 isInitialized 상태를 하위 컴포넌트에 제공합니다
 * URL pathname 변경 시 자동으로 모든 광고를 재로드합니다
 */
export const GenieeProvider = ({ children }: { children?: ReactNode }) => {
  const { isInitialized } = useGenieeAdClient()
  const pathname = usePathname()

  // pathname 변경 감지하여 광고 재로드
  useEffect(() => {
    if (!isInitialized) return

    console.log('[Geniee] Pathname changed, reloading all ads')
    reloadAllAds()
  }, [pathname, isInitialized])

  return (
    <GenieeContext.Provider value={{ isInitialized }}>
      {children}
    </GenieeContext.Provider>
  )
}

/**
 * Geniee 초기화 상태를 가져오는 훅
 */
export const useGenieeContext = () => {
  const context = useContext(GenieeContext)
  if (!context) {
    throw new Error('useGenieeContext must be used within GenieeProvider')
  }
  return context
}
