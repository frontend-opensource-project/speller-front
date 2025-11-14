'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useGenieeAdClient } from '../lib/geniee-ssp'

interface GenieeContextType {
  isInitialized: boolean
}

const GenieeContext = createContext<GenieeContextType | null>(null)

/**
 * Geniee 광고 시스템 초기화를 담당하는 클라이언트 컴포넌트
 * Context를 통해 isInitialized 상태를 하위 컴포넌트에 제공합니다
 */
export const GenieeProvider = ({ children }: { children?: ReactNode }) => {
  const { isInitialized } = useGenieeAdClient()

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
