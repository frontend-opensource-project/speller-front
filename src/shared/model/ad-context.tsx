'use client'

import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  FC,
  useCallback,
} from 'react'

type AdState = {
  isAdFilled: boolean
  isLoading: boolean
  isDoneAd: boolean
}

type AdContextType = {
  adState: AdState
  resetAdState: () => void
  readyAdState: () => void
  failAdState: () => void
}

const AdContext = createContext<AdContextType | null>(null)

const AdProvider: FC<PropsWithChildren> = ({ children }) => {
  const [adState, setAdStateInternal] = useState<AdState>({
    isAdFilled: false,
    isLoading: true,
    isDoneAd: false,
  })

  const setAdState = (next: Partial<AdState>) =>
    setAdStateInternal(prev => ({ ...prev, ...next }))

  const resetAdState = useCallback(() => {
    setAdState({
      isAdFilled: true,
      isLoading: true,
      isDoneAd: false,
    })
  }, [])

  const readyAdState = useCallback(() => {
    setAdState({
      isAdFilled: true,
      isLoading: false,
      isDoneAd: false,
    })
  }, [])

  const failAdState = useCallback(() => {
    setAdState({
      isAdFilled: false,
      isLoading: false,
      isDoneAd: true,
    })
  }, [])

  return (
    <AdContext.Provider
      value={{ adState, resetAdState, readyAdState, failAdState }}
    >
      {children}
    </AdContext.Provider>
  )
}

export const useAdContext = () => {
  const context = useContext(AdContext)

  if (!context) {
    throw new Error('useAdContext must be used within AdStatusProvider')
  }

  return context
}

export { AdProvider }
