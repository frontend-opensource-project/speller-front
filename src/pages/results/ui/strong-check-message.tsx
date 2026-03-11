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
        'flex w-full items-center justify-end text-base font-medium leading-[150%] tracking-[-0.02rem] text-slate-300 dark:text-dark-border pc:text-xl pc:tracking-[-0.025rem]',
        totalPageCnt > 1 && 'absolute right-0 w-auto',
      )}
    >
      {requestedWithStrictMode ? '강한 검사 적용 중' : '강한 검사 미적용'}
    </div>
  )
}

export { StrongCheckMessage }
