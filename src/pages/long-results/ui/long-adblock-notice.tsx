'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ShieldAlertIcon } from 'lucide-react'

interface LongAdblockNoticeProps {
  open: boolean
  onNormalCheck: () => void // 일반 모드에서 검사
}

/**
 * 긴글 모드에 들어왔는데 광고 차단이 감지되면 검사 중 안내창 대신 띄운다.
 * 광고 차단 상태로는 긴글 모드를 쓰지 않으므로 닫을 수 없고, '일반 모드에서 검사'로만 넘어간다.
 */
const LongAdblockNotice = ({ open, onNormalCheck }: LongAdblockNoticeProps) => (
  <DialogPrimitive.Root open={open}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
      <DialogPrimitive.Content
        // Esc · 바깥 클릭으로 닫지 않는다
        onEscapeKeyDown={e => e.preventDefault()}
        onPointerDownOutside={e => e.preventDefault()}
        className='fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[28rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[1.25rem] bg-white px-8 pb-7 pt-9 text-center text-slate-600 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:bg-dark-surface dark:text-dark-text'
      >
        <ShieldAlertIcon
          aria-hidden
          className='size-11 text-slate-400 dark:text-dark-subtle'
        />
        <DialogPrimitive.Title className='mt-5 text-2xl font-semibold tracking-[-0.03rem]'>
          광고 차단이 감지되었습니다
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className='mt-3 break-keep text-base leading-relaxed text-slate-500 dark:text-dark-subtle'>
          바른한글은 광고 수익으로 무료 검사를 운영합니다.
          <br />
          긴글 모드를 쓰시려면 광고 차단을 해제한 뒤 다시 검사해 주세요. 광고
          차단을 유지하신 채로는 일반 모드에서 검사할 수 있습니다.
        </DialogPrimitive.Description>
        <div className='mt-7 flex w-full flex-col gap-2'>
          <button
            type='button'
            onClick={onNormalCheck}
            className='h-11 w-full rounded-lg bg-blue-500 text-lg font-semibold text-white hover:bg-blue-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'
          >
            일반 모드에서 검사
          </button>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
)

export { LongAdblockNotice }
