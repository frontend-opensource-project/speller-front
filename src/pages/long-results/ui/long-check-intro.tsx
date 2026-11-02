'use client'

import { useEffect, useRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Loader2Icon } from 'lucide-react'

// 전면 광고와 함께 보여 준 뒤 저절로 닫히는 시간
const SHOW_MS = 3000

interface LongCheckIntroProps {
  open: boolean
  onClose: () => void
  progress: { done: number; total: number }
}

/**
 * 긴글 모드에 들어오면 전면 광고와 함께 띄우는 "맞춤법 검사 중" 안내창.
 * 뒤에서 검사는 계속되고, 3초 뒤 저절로 닫힌다 (사용자는 광고만 닫으면 된다).
 * 전면 광고가 가운데에 뜨므로 아래쪽에 가로로 넓게 둔다.
 */
const LongCheckIntro = ({ open, onClose, progress }: LongCheckIntroProps) => {
  // 진행이 바뀔 때마다 다시 그려지므로 onClose가 바뀌어도 타이머를 다시 걸지 않는다
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => onCloseRef.current(), SHOW_MS)
    return () => clearTimeout(timer)
  }, [open])

  const isDone = progress.total > 0 && progress.done >= progress.total
  const percent =
    progress.total === 0
      ? 0
      : Math.round((progress.done / progress.total) * 100)

  return (
    // 모달로 열면 Radix가 창 바깥의 클릭을 막고 포커스를 가둔다.
    // 전면 광고는 body 끝에 따로 붙는 요소라 그러면 광고의 닫기 버튼을 누를 수 없으므로 모달로 열지 않는다
    <DialogPrimitive.Root modal={false} open={open}>
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
          // 저절로 닫히므로 Esc · 광고 클릭 · 포커스 이동으로는 닫지 않는다
          onEscapeKeyDown={e => e.preventDefault()}
          onInteractOutside={e => e.preventDefault()}
          onOpenAutoFocus={e => e.preventDefault()}
          // 전면 광고가 화면 가운데에 뜨므로 안내창은 아래쪽 가운데에 가로로 넓게 둔다
          className='fixed bottom-8 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[40rem] -translate-x-1/2 flex-col rounded-[1.25rem] bg-white px-6 py-5 text-slate-600 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 dark:bg-dark-surface dark:text-dark-text'
        >
          {/* 머리: 상태 · 설명 */}
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
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { LongCheckIntro }
