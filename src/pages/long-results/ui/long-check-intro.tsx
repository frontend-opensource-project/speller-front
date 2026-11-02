'use client'

import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Loader2Icon } from 'lucide-react'

// 이 시간 동안은 닫을 수 없다 (전면 광고와 함께 보여 주는 시간)
const LOCK_SECONDS = 3

interface LongCheckIntroProps {
  open: boolean
  onClose: () => void
  progress: { done: number; total: number }
  notice?: string | null // 안내 문구 자리 (config/intro-notice.ts)
}

/**
 * 긴글 모드에 들어오면 전면 광고와 함께 띄우는 "맞춤법 검사 중" 안내창.
 * 뒤에서 검사는 계속되고, 3초 뒤 닫기 버튼이 나온다.
 * 전면 광고가 가운데에 뜨므로 아래쪽에 가로로 넓게 둔다.
 * 머리(상태 · 설명 · 닫기) · 진행 · 안내 문구 칸으로 나눠, 안내 문구를 넣어도 다른 칸이 밀리지 않게 했다.
 */
const LongCheckIntro = ({
  open,
  onClose,
  progress,
  notice,
}: LongCheckIntroProps) => {
  const [remaining, setRemaining] = useState(LOCK_SECONDS)
  const canClose = remaining <= 0

  useEffect(() => {
    if (!open || canClose) return
    const timer = setTimeout(() => setRemaining(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [open, remaining, canClose])

  const isDone = progress.total > 0 && progress.done >= progress.total
  const percent =
    progress.total === 0
      ? 0
      : Math.round((progress.done / progress.total) * 100)

  return (
    // 모달로 열면 Radix가 창 바깥의 클릭을 막고 포커스를 가둔다.
    // 전면 광고는 body 끝에 따로 붙는 요소라 그러면 광고의 닫기 버튼을 누를 수 없으므로 모달로 열지 않는다
    <DialogPrimitive.Root
      modal={false}
      open={open}
      onOpenChange={next => {
        if (!next && canClose) onClose()
      }}
    >
      <DialogPrimitive.Portal>
        {/* 모달이 아니면 Radix가 배경을 그리지 않으므로 직접 그린다.
            아래 교정 화면만 덮고, 전면 광고는 이 위에 떠서 가리지 않는다.
            Portal이 자식마다 열림 상태에 맞춰 붙이고 떼므로 조건 없이 둔다 */}
        <div
          aria-hidden
          className='fixed inset-0 z-50 bg-black/60 duration-200 animate-in fade-in-0'
        />
        <DialogPrimitive.Content
          aria-modal
          // 닫을 수 있게 되기 전에는 Esc로도 닫지 않는다.
          // 광고를 누르거나 포커스가 광고로 가도 닫지 않는다 (닫기 버튼으로만)
          onEscapeKeyDown={e => {
            if (!canClose) e.preventDefault()
          }}
          onInteractOutside={e => e.preventDefault()}
          onOpenAutoFocus={e => e.preventDefault()}
          // 전면 광고가 화면 가운데에 뜨므로 안내창은 아래쪽 가운데에 가로로 넓게 둔다
          className='fixed bottom-8 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[40rem] -translate-x-1/2 flex-col rounded-[1.25rem] bg-white px-6 py-5 text-slate-600 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 dark:bg-dark-surface dark:text-dark-text'
        >
          {/* 머리: 상태 · 설명 · 닫기 */}
          <div className='flex items-center gap-4'>
            <Loader2Icon
              aria-hidden
              className='size-9 shrink-0 animate-spin text-blue-500 dark:text-blue-200'
            />
            <div className='min-w-0 flex-1'>
              <DialogPrimitive.Title className='text-xl font-semibold tracking-[-0.025rem]'>
                {isDone ? '맞춤법 검사 완료' : '맞춤법 검사 중'}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className='mt-0.5 text-base leading-relaxed text-slate-500 dark:text-dark-subtle'>
                긴 글은 나누어 검사합니다. 화면에 보이는 부분부터 차례로 결과가
                나타납니다.
              </DialogPrimitive.Description>
            </div>
            {/* 닫기: 버튼이 나타나도 줄이 흔들리지 않도록 자리를 잡아 둔다 */}
            <div className='flex h-10 w-[6.5rem] shrink-0 items-center justify-center'>
              {canClose ? (
                <DialogPrimitive.Close className='h-10 w-full rounded-lg bg-blue-500 text-base font-semibold text-white hover:bg-blue-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'>
                  닫기
                </DialogPrimitive.Close>
              ) : (
                <p
                  aria-live='polite'
                  className='text-sm tabular-nums text-slate-400 dark:text-dark-subtle'
                >
                  {remaining}초 뒤 닫기
                </p>
              )}
            </div>
          </div>

          {/* 진행 */}
          <div className='mt-4 flex items-center gap-3'>
            <div
              role='progressbar'
              aria-label='검사한 구간'
              aria-valuemin={0}
              aria-valuemax={progress.total}
              aria-valuenow={progress.done}
              className='h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-dark-elevated'
            >
              <div
                className='h-full bg-blue-500 transition-[width] duration-300 dark:bg-blue-300'
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className='shrink-0 text-sm tabular-nums text-slate-400 dark:text-dark-subtle'>
              {progress.done}/{progress.total}구간
            </span>
          </div>

          {/* 안내 문구 자리: 넣으면 진행 아래에 붙고 창이 위로 늘어난다 */}
          {notice && (
            <div className='mt-4 whitespace-pre-line rounded-xl bg-slate-100 px-5 py-3 text-base leading-relaxed dark:bg-dark-elevated'>
              {notice}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { LongCheckIntro }
