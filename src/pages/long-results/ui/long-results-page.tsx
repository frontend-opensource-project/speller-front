'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  CHECK_ERROR_MESSAGE,
  errorKey,
  getLongProgress,
  getPageText,
  selectLongError,
} from '@/entities/speller'
import { useAppDispatch, useAppSelector } from '@/shared/lib/use-redux'
import { ContentLayout } from '@/shared/ui/content-layout'
import { Button } from '@/shared/ui/button'
import { useVisiblePages } from '../model/use-visible-pages'
import { useCheckQueue } from '../model/use-check-queue'
import { LongPageSection } from './long-page-section'

// 시간 초과가 연달아 이만큼 나면 문단을 나눠 보라고 안내한다
const TIMEOUT_HINT_COUNT = 3

const LongResultsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.longCheck)
  const { originalText, pages, ignored, selected } = state
  const containerRef = useRef<HTMLDivElement>(null)

  const { viewport, isScrolling } = useVisiblePages(containerRef, pages.length)
  const queue = useCheckQueue({ viewport, isScrolling })

  // 입력 화면을 거치지 않고 들어온 경우
  useEffect(() => {
    if (!originalText) router.replace('/invalid-access')
  }, [originalText, router])

  const progress = getLongProgress(state)
  const remainingErrors = useMemo(
    () =>
      pages.reduce(
        (count, page, pageIdx) =>
          count +
          page.errInfo.filter(
            info =>
              info.crtStr === undefined &&
              !ignored[errorKey(pageIdx, info.errorIdx)],
          ).length,
        0,
      ),
    [pages, ignored],
  )

  const handleSelectError = useCallback(
    (pageIdx: number, errorIdx: number) =>
      dispatch(selectLongError({ pageIdx, errorIdx })),
    [dispatch],
  )
  const { retry } = queue
  const handleRetry = useCallback((pageIdx: number) => retry(pageIdx), [retry])

  if (!originalText) return null

  return (
    <ContentLayout className='pb-4 pc:pb-5'>
      <div className='flex min-h-8 items-center justify-between gap-4 pb-3 pt-6'>
        <h1 className='text-xl font-semibold'>
          교정 문서{' '}
          <span className='text-base font-medium text-slate-400 dark:text-dark-subtle'>
            긴글 모드
          </span>
        </h1>
        <div className='flex items-center gap-4 text-base text-slate-600 dark:text-dark-text'>
          <span>
            검사한 구간 {progress.done} / {progress.total}
          </span>
          <span>남은 오류 {remainingErrors}개</span>
        </div>
      </div>
      <div className='flex min-h-0 flex-col gap-2'>
        {queue.paused && (
          <div
            role='alert'
            className='bg-yellow-50 flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-base dark:bg-yellow-500/10'
          >
            <span className='whitespace-pre-line'>
              {CHECK_ERROR_MESSAGE.rate}
            </span>
            <Button variant='outline' onClick={queue.resume}>
              다시 시작
            </Button>
          </div>
        )}
        {queue.consecutiveTimeouts >= TIMEOUT_HINT_COUNT && (
          <div
            role='status'
            className='rounded-lg bg-slate-100 px-4 py-3 text-base dark:bg-dark-surface'
          >
            서버 응답이 계속 늦습니다. 줄바꿈을 넣어 문단을 나누면 검사가 잘 될
            수 있습니다.
          </div>
        )}
        <div
          ref={containerRef}
          className='h-[calc(100dvh-16rem)] min-h-[30rem] overflow-y-auto rounded-[1rem] bg-white p-6 dark:bg-dark-surface'
        >
          {pages.map((page, pageIdx) => (
            <LongPageSection
              key={`${page.start}:${page.end}`}
              pageIdx={pageIdx}
              page={page}
              text={getPageText(state, pageIdx)}
              ignored={ignored}
              selectedErrorIdx={
                selected?.pageIdx === pageIdx ? selected.errorIdx : null
              }
              onSelectError={handleSelectError}
              onRetry={handleRetry}
            />
          ))}
        </div>
      </div>
    </ContentLayout>
  )
}

export { LongResultsPage }
