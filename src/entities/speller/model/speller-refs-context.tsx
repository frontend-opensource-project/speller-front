'use client'

import { createContext, useContext, useRef } from 'react'
import { ScrollContainerHandle } from '@/shared/ui/scroll-container'

interface SpellerRefsContextType {
  correctRefs: React.MutableRefObject<(HTMLElement | null)[]> | null
  errorRefs: React.MutableRefObject<(HTMLElement | null)[]> | null
  correctScrollContainerRef: React.RefObject<ScrollContainerHandle> | null
  errorScrollContainerRef: React.RefObject<ScrollContainerHandle> | null
  scrollSection: (target: 'correct' | 'error', index: number) => void
}

const SpellerRefsContext = createContext<SpellerRefsContextType | null>(null)

export const SpellerRefsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const correctScrollContainerRef = useRef<ScrollContainerHandle>(null)
  const errorScrollContainerRef = useRef<ScrollContainerHandle>(null)

  const correctRefs = useRef<(HTMLElement | null)[]>([])
  const errorRefs = useRef<(HTMLElement | null)[]>([])

  const scrollSection = (target: 'correct' | 'error', index: number) => {
    const refs = target === 'correct' ? correctRefs : errorRefs
    const scrollContainerRef =
      target === 'correct' ? correctScrollContainerRef : errorScrollContainerRef

    if (!refs || !scrollContainerRef.current) return

    const targetElement = refs.current[index]

    if (targetElement && scrollContainerRef.current) {
      scrollContainerRef.current.scrollToElement(targetElement)
    }
  }

  return (
    <SpellerRefsContext.Provider
      value={{
        correctRefs,
        errorRefs,
        correctScrollContainerRef,
        errorScrollContainerRef,
        scrollSection,
      }}
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
