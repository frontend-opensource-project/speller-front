'use client'

import { createContext, useContext, createRef, useRef } from 'react'
import { useSpeller } from './use-speller'
import { ScrollContainerHandle } from '@/shared/ui/scroll-container'
import { useDesktop } from '@/shared/lib/use-desktop'

interface SpellerRefsContextType {
  correctRefs: React.RefObject<HTMLDivElement>[] | null
  errorRefs: React.RefObject<HTMLDivElement>[] | null
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
  const { response, correctInfo } = useSpeller()
  const isDesktop = useDesktop()

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

  const scrollSection = (target: 'correct' | 'error', index: number) => {
    const refs = target === 'correct' ? correctRefs : errorRefs
    const scrollContainerRef =
      target === 'correct' ? correctScrollContainerRef : errorScrollContainerRef

    if (!refs || !scrollContainerRef.current) return

    const targetElement = refs[index]?.current

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
