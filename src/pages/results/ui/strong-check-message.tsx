'use client'

import { useSpeller } from '@/entities/speller'

const StrongCheckMessage = () => {
  const {
    response: { requestedWithStrictMode },
  } = useSpeller()

  return (
    <div className='flex w-full items-center justify-end text-base font-medium leading-[150%] tracking-[-0.02rem] text-slate-300 tab:absolute tab:right-0 tab:w-auto pc:text-xl pc:tracking-[-0.025rem]'>
      {requestedWithStrictMode ? '강한 검사 적용 중' : '강한 검사 미적용'}
    </div>
  )
}

export { StrongCheckMessage }
