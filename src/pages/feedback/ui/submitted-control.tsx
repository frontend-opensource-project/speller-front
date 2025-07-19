'use client'

import { Button } from '@/shared/ui/button'
import { useRouter } from 'next/navigation'

const SubmittedControl = () => {
  const router = useRouter()

  return (
    <div className='flex justify-center gap-3 pb-16 tab:pb-[10.25rem] pc:justify-start pc:gap-4 pc:pb-[4.375rem] pc:pt-7'>
      <Button
        variant='outline'
        className={`${BUTTON_BASE_STYLE} border-2 border-blue-500 bg-white text-blue-500`}
        onClick={() => router.push('/feedback')}
      >
        다시 제출
      </Button>
      <Button
        className={`${BUTTON_BASE_STYLE} text-white`}
        onClick={() => router.push('/speller')}
      >
        홈으로 이동
      </Button>
    </div>
  )
}

const BUTTON_BASE_STYLE =
  'h-[3.375rem] w-32 rounded-[0.5rem] text-lg font-semibold pc:h-[4.05rem] pc:w-[9.6rem] pc:text-[1.35rem]'

export { SubmittedControl }
