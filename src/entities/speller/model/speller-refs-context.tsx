'use client'

import { useWindowSize } from '@frontend-opensource/use-react-hooks'
import { createContext, useContext, createRef, useRef } from 'react'
import { useSpeller } from './use-speller'

interface SpellerRefsContextType {
  correctRefs: React.RefObject<HTMLDivElement>[] | null
  errorRefs: React.RefObject<HTMLDivElement>[] | null
  correctScrollContainerRef: React.RefObject<HTMLDivElement> | null
  errorScrollContainerRef: React.RefObject<HTMLDivElement> | null
  scrollSection: (target: 'correct' | 'error', index: number) => void
}

const SpellerRefsContext = createContext<SpellerRefsContextType | null>(null)

export const SpellerRefsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const correctScrollContainerRef = useRef<HTMLDivElement>(null)
  const errorScrollContainerRef = useRef<HTMLDivElement>(null)
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

  const scrollToElement = (
    scrollContainer: HTMLDivElement,
    targetElement: HTMLDivElement,
  ) => {
    const containerRect = scrollContainer.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()

    const offsetTop =
      targetRect.top - containerRect.top + scrollContainer.scrollTop

    scrollContainer.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    })
  }

  const scrollSection = (target: 'correct' | 'error', index: number) => {
    const refs = target === 'correct' ? correctRefs : errorRefs
    const scrollContainerRef =
      target === 'correct' ? correctScrollContainerRef : errorScrollContainerRef

    if (!refs || !scrollContainerRef.current) return

    const targetElement = refs[index]?.current
    const container = scrollContainerRef.current

    if (targetElement && container) {
      scrollToElement(container, targetElement)
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
