'use client'

import { memo, ReactNode } from 'react'
import {
  CHECK_ERROR_MESSAGE,
  errorKey,
  getTextMethodColor,
  parseCandidateWords,
  type LongCheckState,
  type LongPage,
} from '@/entities/speller'
import { Button } from '@/shared/ui/button'
import { Spinner } from '@/shared/ui/spinner'
import { cn } from '@/shared/lib/tailwind-merge'

interface LongPageSectionProps {
  pageIdx: number
  page: LongPage
  text: string // 이 구간의 원문
  ignored: LongCheckState['ignored']
  selectedErrorIdx: number | null // 이 구간에서 선택된 오류
  onSelectError: (pageIdx: number, errorIdx: number) => void
  onRetry: (pageIdx: number) => void
}

// 구간은 '\n' 자리에서 잘려 다음 구간이 '\n'으로 시작한다.
// 구간마다 블록으로 그리므로 맨 앞 '\n'은 그리지 않는다 (빈 줄이 하나 더 생김)
const leadingBreak = (text: string) => (text.startsWith('\n') ? 1 : 0)

const renderErrors = ({
  pageIdx,
  page,
  text,
  ignored,
  selectedErrorIdx,
  onSelectError,
}: LongPageSectionProps) => {
  const parts: ReactNode[] = []
  let last = leadingBreak(text)
  const errors = [...page.errInfo].sort((a, b) => a.start - b.start)

  errors.forEach(info => {
    if (info.start < last) return // 겹치는 오류는 앞의 것만 그린다
    if (info.start > last) parts.push(text.slice(last, info.start))

    const isIgnored = !!ignored[errorKey(pageIdx, info.errorIdx)]
    const isCorrected = info.crtStr !== undefined
    const firstCandidate = parseCandidateWords(info.candWord)[0]?.word ?? ''

    parts.push(
      isIgnored ? (
        <span key={info.errorIdx}>{text.slice(info.start, info.end)}</span>
      ) : (
        <button
          key={info.errorIdx}
          type='button'
          data-error-idx={info.errorIdx}
          title={firstCandidate ? `→ ${firstCandidate}` : undefined}
          onClick={() => onSelectError(pageIdx, info.errorIdx)}
          className={cn(
            'inline whitespace-pre-wrap rounded-sm font-bold',
            isCorrected
              ? 'text-slate-600 dark:text-dark-text'
              : cn(
                  'underline decoration-[2px] underline-offset-[25%]',
                  getTextMethodColor(info.correctMethod),
                ),
            selectedErrorIdx === info.errorIdx &&
              'bg-blue-100 dark:bg-blue-500/20',
          )}
        >
          {isCorrected ? info.crtStr : text.slice(info.start, info.end)}
        </button>
      ),
    )
    last = info.end
  })
  parts.push(text.slice(last))
  return parts
}

const PageStatus = ({
  page,
  onRetry,
}: {
  page: LongPage
  onRetry: () => void
}) => {
  if (page.status === 'done') return null
  if (page.status === 'failed') {
    return (
      <div
        role='alert'
        className='bg-red-50 dark:bg-red-500/10 mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-base text-slate-600 dark:text-dark-text'
      >
        <span className='whitespace-pre-line'>
          이 부분을 검사하지 못했습니다.{' '}
          {page.error ? CHECK_ERROR_MESSAGE[page.error.kind] : ''}
        </span>
        <Button size='sm' variant='outline' onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    )
  }
  return (
    <div className='mb-1 flex items-center gap-2 text-sm text-slate-400 dark:text-dark-subtle'>
      {page.status === 'loading' ? (
        <>
          <Spinner /> 검사 중
        </>
      ) : (
        '검사 대기'
      )}
    </div>
  )
}

/** 교정 문서의 한 구간. 검사 상태에 따라 원문 · 오류 표시 · 실패 안내를 그린다 */
const LongPageSection = memo((props: LongPageSectionProps) => {
  const { pageIdx, page, text, onRetry } = props
  const isDone = page.status === 'done'

  return (
    <section
      data-page-idx={pageIdx}
      aria-busy={page.status === 'loading' || page.status === 'queued'}
      className='py-1'
    >
      <PageStatus page={page} onRetry={() => onRetry(pageIdx)} />
      <p
        className={cn(
          'whitespace-pre-wrap break-all text-[1.125rem] leading-[170%] tracking-[-0.0225rem] pc:text-[1.25rem] pc:tracking-[-0.025rem]',
          !isDone && 'text-slate-400 dark:text-dark-subtle',
        )}
      >
        {isDone ? renderErrors(props) : text.slice(leadingBreak(text))}
      </p>
    </section>
  )
})

LongPageSection.displayName = 'LongPageSection'

export { LongPageSection }
