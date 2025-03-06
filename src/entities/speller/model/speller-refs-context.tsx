'use client'

import { useWindowSize } from '@frontend-opensource/use-react-hooks'
import { createContext, useContext, useCallback, createRef } from 'react'
import { useSpeller } from './use-speller'

interface SpellerRefsContextType {
  correctRefs: React.RefObject<HTMLDivElement>[] | null
  errorRefs: React.RefObject<HTMLDivElement>[] | null
  scrollSection: (target: 'correct' | 'error') => (index: number) => void
}

const SpellerRefsContext = createContext<SpellerRefsContextType | null>(null)

export const SpellerRefsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { response, correctInfo } = useSpeller()
  const { width } = useWindowSize()
  const isDesktop = width && width >= 1377

  const correctRefs = isDesktop
    ? Array.from({ length: Object.keys(correctInfo).length }, () =>
        createRef<HTMLDivElement>(),
      )
    : null

  const errorRefs = isDesktop
    ? Array.from({ length: response?.errInfo.length }, () =>
        createRef<HTMLDivElement>(),
      )
    : null

  const scrollSection = useCallback(
    (target: 'correct' | 'error') => (index: number) => {
      const refs = target === 'correct' ? correctRefs : errorRefs
      refs?.[index].current?.scrollIntoView({ behavior: 'smooth' })
    },
    [correctRefs, errorRefs],
  )

  return (
    <SpellerRefsContext.Provider
      value={{ correctRefs, errorRefs, scrollSection }}
    >
      {children}
    </SpellerRefsContext.Provider>
  )
}

export const useSpellerRefs = () => {
  const context = useContext(SpellerRefsContext)
  if (!context) {
    throw new Error('useSpellerRefs must be used within SpellerRefsProvider')
  }
  return context
}
