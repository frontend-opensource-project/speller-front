'use client'

import Image from 'next/image'
import { Button } from '@/shared/ui/button'

interface LongToolbarProps {
  progress: { done: number; total: number }
  remainingErrors: number
  isStrictCheck: boolean
  canRequestAll: boolean // 아직 검사하지 않은 구간이 있고 모두 검사를 누르지 않았음
  onRequestAll: () => void
  onScrollTop: () => void
  onCopyAll: () => void
  onNewText: () => void
  onBack: () => void
}

/** 긴글 화면 상단 바: 진행률 · 남은 오류 수 · 편의 버튼 */
const LongToolbar = ({
  progress,
  remainingErrors,
  isStrictCheck,
  canRequestAll,
  onRequestAll,
  onScrollTop,
  onCopyAll,
  onNewText,
  onBack,
}: LongToolbarProps) => {
  const percent =
    progress.total === 0
      ? 0
      : Math.round((progress.done / progress.total) * 100)

  return (
    <div className='flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pb-3 pt-6'>
      <div className='flex min-w-0 items-center gap-4'>
        <h1 className='whitespace-nowrap text-xl font-semibold'>
          교정 문서
          <span className='ml-2 text-base font-medium text-slate-400 dark:text-dark-subtle'>
            긴글 모드{isStrictCheck && ' · 강한 검사'}
          </span>
        </h1>
        <div className='flex items-center gap-2 text-base text-slate-600 dark:text-dark-text'>
          <div
            role='progressbar'
            aria-label='검사한 구간'
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-valuenow={progress.done}
            className='h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-dark-elevated'
          >
            <div
              className='h-full bg-blue-500 transition-[width]'
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className='whitespace-nowrap'>
            {progress.done}/{progress.total}구간
          </span>
          <span className='whitespace-nowrap text-slate-400 dark:text-dark-subtle'>
            · 남은 오류 {remainingErrors}개
          </span>
        </div>
        {canRequestAll && (
          <Button size='sm' variant='outline' onClick={onRequestAll}>
            남은 부분 모두 검사
          </Button>
        )}
      </div>
      <div className='flex items-center'>
        <ActionButton label='맨 위로' onClick={onScrollTop}>
          <span aria-hidden className='text-xl leading-6'>
            ↑
          </span>
        </ActionButton>
        <ActionButton label='새글쓰기' onClick={onNewText}>
          <IconImage src='/icon/icon-new-article.svg' />
        </ActionButton>
        <ActionButton label='돌아가기' onClick={onBack}>
          <IconImage src='/icon/icon-arrow-return-left.svg' />
        </ActionButton>
        <ActionButton label='전체복사' onClick={onCopyAll}>
          <IconImage src='/icon/icon-copy-all.svg' />
        </ActionButton>
      </div>
    </div>
  )
}

const IconImage = ({ src }: { src: string }) => (
  <Image src={src} width={24} height={24} alt='' aria-hidden />
)

// 기존 결과 화면의 버튼과 같은 모양
const ActionButton = ({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) => (
  <Button variant='ghost' onClick={onClick} className='size-fit rounded-lg p-2'>
    <span className='flex flex-col items-center'>
      <span className='flex size-6 items-center justify-center'>
        {children}
      </span>
      <span className='text-base font-medium leading-[1.6rem] text-slate-400 dark:text-dark-subtle'>
        {label}
      </span>
    </span>
  </Button>
)

export { LongToolbar }
