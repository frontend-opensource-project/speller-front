'use client'

import { BaseLayout } from '@/shared/ui/base-layout'

export default function GlobalError() {
  return (
    <html lang='ko'>
      <body>
        <BaseLayout>
          <div className='mx-4 mb-12 mt-[3.065rem] flex w-full flex-col items-center justify-center rounded-lg bg-white p-5 tab:mx-[3.75rem] tab:mt-[3.875rem] tab:rounded-[1rem] pc:mx-0 pc:mt-[4.5rem]'>
            <h2 className='text-2xl font-semibold leading-[150%] tracking-tight tab:text-[2rem] pc:text-[3rem]'>
              오류가 발생했습니다
            </h2>
            <p className='mt-3 text-center text-base font-normal leading-[140%] tracking-tight text-slate-600 tab:text-xl pc:mt-6 pc:text-2xl'>
              이 문제를 해결하는 동안 잠시 기다렸다가
              <br className='hidden tab:block' /> 다시 시도해 주세요. 지속적으로
              오류가 발생할 경우에는
              <br className='hidden tab:block' /> urimal@pusan.ac.kr로 문의해
              주세요.
            </p>
            <div className='mt-7 flex gap-3 tab:mt-8 pc:mt-11 pc:gap-4'>
              <a
                href='mailto:urimal@pusan.ac.kr'
                className='flex h-[3.375rem] w-[8rem] items-center justify-center rounded-lg border-2 border-primary bg-white p-0 text-lg font-semibold text-primary pc:h-[4rem] pc:w-[9.5rem] pc:text-xl'
              >
                문의하기
              </a>
              <a
                href='/'
                className='flex h-[3.375rem] w-[8rem] items-center justify-center rounded-lg bg-primary p-0 text-lg font-semibold text-white pc:h-[4rem] pc:w-[9.5rem] pc:text-xl'
              >
                처음 페이지
              </a>
            </div>
          </div>
        </BaseLayout>
      </body>
    </html>
  )
}
