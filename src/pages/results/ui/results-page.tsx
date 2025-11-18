'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { reloadAd, GENIEE_IDS } from '@/shared/lib/geniee-ssp'

const ResultsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { responseMap } = useSpeller()
  const contentRef = useRef<HTMLDivElement>(null)
  const breakpoint = useBreakpoint()

  // Pagination 광고 reload용
  const currentPage = Number(searchParams?.get('page')) || 1
  const lastPageRef = useRef(currentPage)
  const pageChangeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const breakpointRef = useRef(breakpoint)

  // breakpoint 변경 시 ref 업데이트
  useEffect(() => {
    breakpointRef.current = breakpoint
  }, [breakpoint])

  useEffect(() => {
    if (Object.keys(responseMap).length === 0) {
      router.replace('/invalid-access')
      return
    }

    /*if (breakpoint === 'desktop' || breakpoint === 'desktop-large') {
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
    }*/
  }, [responseMap, router, breakpoint])

  // Pagination 페이지 변경 시 광고 reload (Debouncing 3초)
  useEffect(() => {
    if (lastPageRef.current !== currentPage) {
      lastPageRef.current = currentPage

      // 기존 타이머 클리어
      if (pageChangeTimerRef.current) {
        clearTimeout(pageChangeTimerRef.current)
      }

      // 3초 후 광고 reload
      pageChangeTimerRef.current = setTimeout(() => {
        console.log(
          '[ResultsPage] Page settled after 3s, reloading ads for page:',
          currentPage,
        )

        // 타이머 실행 시점의 최신 breakpoint 사용
        const currentBreakpoint = breakpointRef.current

        // FooterGeniee (모든 디바이스)
        reloadAd(GENIEE_IDS.OVERLAY_ID)

        // breakpoint에 따라 표시되는 광고만 reload
        if (
          currentBreakpoint === 'desktop' ||
          currentBreakpoint === 'desktop-large'
        ) {
          // MainGeniee
          reloadAd(GENIEE_IDS.BANNER_ID_160x600)
        } else if (
          currentBreakpoint === 'mobile' ||
          currentBreakpoint === 'tablet'
        ) {
          // CenterGeniee
          reloadAd(GENIEE_IDS.BANNER_ID_729x90)
        }
      }, 3000)
    }

    return () => {
      if (pageChangeTimerRef.current) {
        clearTimeout(pageChangeTimerRef.current)
      }
    }
  }, [currentPage])

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
