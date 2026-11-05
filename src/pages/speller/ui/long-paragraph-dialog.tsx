'use client'

import { useRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { TriangleAlertIcon } from 'lucide-react'

interface LongParagraphDialogProps {
  open: boolean
  onContinue: () => void // 계속 검사
  onLocate: () => void // 문단 확인: 창이 닫힌 뒤 그 문단으로 커서를 옮긴다
  onCancel: () => void
}

/**
 * 검사하기를 눌렀을 때 너무 긴 문단이 있으면 띄우는 경고.
 * 개행 없는 문단은 한 번에 검사되므로 길면 검사 서버 실행 제한에 걸려 결과가 오지 않을 수 있다.
 */
const LongParagraphDialog = ({
  open,
  onContinue,
  onLocate,
  onCancel,
}: LongParagraphDialogProps) => {
  // 창이 닫히면 Radix가 검사하기 버튼으로 포커스를 되돌리므로, 그 뒤에 입력창으로 옮긴다
  const locateOnCloseRef = useRef(false)
  const locateButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={next => {
        if (!next) onCancel()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <DialogPrimitive.Content
          // 강조한 문단 확인 버튼에 먼저 포커스를 둔다 (Enter로 바로 계속 검사되지 않게)
          onOpenAutoFocus={e => {
            e.preventDefault()
            locateButtonRef.current?.focus()
          }}
          onCloseAutoFocus={e => {
            if (!locateOnCloseRef.current) return
            locateOnCloseRef.current = false
            e.preventDefault()
            onLocate()
          }}
          className='fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[28rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[1.25rem] bg-white px-6 pb-6 pt-8 text-center text-slate-600 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:bg-dark-surface dark:text-dark-text pc:max-w-[32rem] pc:px-8 pc:pb-7 pc:pt-9'
        >
          <TriangleAlertIcon
            aria-hidden
            className='size-10 text-yellow-500 pc:size-11'
          />
          <DialogPrimitive.Title className='mt-4 text-xl font-semibold tracking-[-0.025rem] pc:mt-5 pc:text-2xl'>
            너무 긴 문단이 있습니다
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className='mt-3 break-keep text-base leading-relaxed text-slate-500 dark:text-dark-subtle'>
            {/* 가운데 정렬이라 문장 중간에서 줄이 바뀌지 않도록 한 줄씩 나눈다 */}
            <span className='block'>
              이대로 검사하면 결과가 나오지 않을 수 있습니다.
            </span>
            <span className='block'>
              줄바꿈으로 문단을 나누면 훨씬 빠르게 검사할 수 있습니다.
            </span>
            <span className='block'>그래도 계속 검사하시겠습니까?</span>
          </DialogPrimitive.Description>
          <div className='mt-6 flex w-full gap-2 pc:mt-7'>
            <button
              type='button'
              onClick={onContinue}
              className='h-11 flex-1 rounded-lg border border-slate-200 text-lg font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-elevated'
            >
              계속 검사
            </button>
            <button
              ref={locateButtonRef}
              type='button'
              onClick={() => {
                locateOnCloseRef.current = true
                onCancel()
              }}
              className='h-11 flex-1 rounded-lg bg-blue-500 text-lg font-semibold text-white hover:bg-blue-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'
            >
              문단 확인
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { LongParagraphDialog }
