'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSpeller } from '@/entities/speller'
import { useBreakpoint } from '@/shared/lib/use-break-point'
import { SpellerRefsProvider } from '@/entities/speller'
import { ContentLayout } from '@/shared/ui/content-layout'
import { Navigator } from './navigator'
import { StrongCheckMessage } from './strong-check-message'
import { CorrectionContent } from './correction-content'
import { ResultsControl } from './results-control'
import { ErrorTrackingSection } from './error-tracking-section'
import { CenterGeniee } from '@/shared/ui/center-geniee'
import { cn } from '@/shared/lib/tailwind-merge'

const ResultsPage = () => {
  const router = useRouter()
  const { responseMap } = useSpeller()
  const contentRef = useRef<HTMLDivElement>(null)
  const breakpoint = useBreakpoint()

  useEffect(() => {
    if (Object.keys(responseMap).length === 0) {
      router.replace('/invalid-access')
      return
    }

    if (breakpoint === 'desktop' || breakpoint === 'desktop-large') {
      if (
        document.documentElement.scrollHeight >
        document.documentElement.clientHeight
      ) {
        // 2. contentRef의 시작 지점으로 부드럽게 스크롤
        contentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }, [responseMap, router, breakpoint])

  if (Object.keys(responseMap).length === 0) {
    router.replace('/invalid-access')
    return null
  }

  return (
    <SpellerRefsProvider>
      <ContentLayout className='pb-4 tab:pb-10 pc:pb-5'>
        <div className='sticky -top-2 z-10 flex min-h-[1.625rem] items-center justify-between bg-background pb-2 pt-4 tab:-top-3 tab:justify-center tab:pt-[1.25rem] pc:min-h-8 pc:pb-3 pc:pt-6'>
          <Navigator />
          <StrongCheckMessage />
        </div>
        {/* 교정 문서 & 맞춤법/문법 오류 레이아웃*/}
        <div
          className='flex h-full flex-col gap-2 overflow-hidden pc:flex-row pc:gap-0'
          ref={contentRef}
        >
          {/* 교정 문서*/}
          <div className='content-visibility-auto flex min-h-[30.5rem] flex-col rounded-lg bg-white p-4 contain-strict tab:rounded-[1rem] tab:p-5 pc:w-1/2 pc:rounded-br-none pc:rounded-tr-none pc:p-6'>
            <CorrectionContent />
            {/* 글자수 & 돌아가기, 복사하기 버튼 */}
            <ResultsControl />
          </div>
          <CenterGeniee includeDevice={['mobile', 'tablet']} />
          {/* 맞춤법/문법 오류 */}
          <div
            className={cn(
              'content-visibility-auto flex min-h-[30.5rem] flex-col rounded-lg border border-blue-500 bg-white p-4 contain-strict tab:rounded-[1rem] tab:p-5 pc:w-1/2 pc:rounded-bl-none pc:rounded-tl-none pc:border-none pc:p-6',
              '@container',
            )}
          >
            <ErrorTrackingSection />
          </div>
        </div>
      </ContentLayout>
    </SpellerRefsProvider>
  )
}

export { ResultsPage }
