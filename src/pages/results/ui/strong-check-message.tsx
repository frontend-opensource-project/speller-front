'use client'

import { useSpeller } from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'

const StrongCheckMessage = () => {
  const {
    response: { requestedWithStrictMode, totalPageCnt },
  } = useSpeller()

  return (
    <div
      className={cn(
        'flex w-full items-center justify-end text-base font-medium leading-[150%] tracking-[-0.02rem] text-slate-300 pc:text-xl pc:tracking-[-0.025rem]',
        totalPageCnt > 1 && 'tab:absolute tab:right-0',
      )}
    >
      {requestedWithStrictMode
        ? '강한 검사가 적용되었습니다.'
        : '강한 검사가 적용되지 않았습니다.'}
    </div>
  )
}

export { StrongCheckMessage }
