'use client'
import { createContext, useState, useContext, useCallback } from 'react'

interface AdRefreshContextType {
  refreshKey: number
  triggerAdRefresh: () => void
}

const AdRefreshContext = createContext<AdRefreshContextType | undefined>(
  undefined,
)

export const AdRefreshProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [refreshKey, setRefreshKey] = useState(Date.now())
  const triggerAdRefresh = useCallback(() => setRefreshKey(Date.now()), [])

  return (
    <AdRefreshContext.Provider value={{ refreshKey, triggerAdRefresh }}>
      {children}
    </AdRefreshContext.Provider>
  )
}

export const useAdRefresh = () => {
  const context = useContext(AdRefreshContext)
  if (context === undefined) {
    throw new Error('useAdRefresh must be used within a AdRefreshProvider')
  }
  return context
}
