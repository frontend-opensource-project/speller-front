'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/shared/ui/button'
import { SpellerSetting } from '@/entities/speller'
import { ContentLayout } from '@/shared/ui/content-layout'
import timeoutMobileImage from '../../../../public/timeout-mo.png'
import timeoutTabImage from '../../../../public/timeout-tab.png'
import timeoutPcImage from '../../../../public/timeout-pc.png'

const TimeoutPage = () => {
  const router = useRouter()

  return (
    <ContentLayout className='pb-8 tab:pb-[2.625rem] pc:pb-12'>
      <div className='mb-2 mt-[0.94rem] min-h-[1.625rem] tab:mt-[1.75rem] pc:mb-[0.78rem] pc:mt-[1.97rem] pc:min-h-8'>
        <SpellerSetting />
      </div>
      <div className='pc:flex'>
        <div className='h-[15.5rem] overflow-hidden rounded-tl-[1rem] rounded-tr-[1rem] tab:h-[14.25rem] pc:h-[40.25rem] pc:w-[23.75rem] pc:rounded-bl-[1rem] pc:rounded-tr-none'>
          <Image
            src={timeoutMobileImage}
            alt='no-errors-mobile'
            sizes='100vw'
            className='h-full w-full bg-background object-cover object-center tab:hidden pc:hidden'
          />
          <Image
            src={timeoutTabImage}
            alt='no-errors-tab'
            sizes='100vw'
            className='hidden h-full w-full bg-background object-cover object-center tab:block pc:hidden'
          />
          <Image
            src={timeoutPcImage}
            alt='no-errors-pc'
            sizes='100vw'
            className='hidden w-full bg-background pc:block'
          />
        </div>
        <div className='rounded-bl-[1rem] rounded-br-[1rem] bg-white pt-7 text-center pc:h-[40.25rem] pc:flex-1 pc:content-center pc:rounded-bl-none pc:rounded-tr-[1rem] pc:pc:pl-[3.125rem] pc:text-left'>
          <h2 className='text-2xl font-semibold tracking-[-0.03rem] text-slate-600 tab:text-[2rem] tab:leading-[3rem] tab:tracking-[-0.04rem] pc:text-5xl pc:tracking-[-0.06rem]'>
            검사가 중단되었습니다.
          </h2>
          <p className='mb-4 mt-2 text-primary tab:mb-5 tab:mt-3 pc:mb-7 pc:mt-6'>
            [ 검사 시간 초과 ]
          </p>
          <div className='pt-2 text-base tracking-[-0.02rem] tab:mt-3 tab:text-[1rem] tab:tracking-[-0.025rem] pc:mt-6 pc:text-2xl pc:tracking-[-0.03rem]'>
            <p>너무 긴 문장을 입력했다면, 중간에 줄바꿈을 추가해</p>
            <p>여러 문장으로 나누어 다시 시도 부탁드립니다.</p>
            <p>혹시 짧은 문장인데도 해당 페이지가 나타났다면,</p>
            <p>상단에 위치한 ‘문의하기’를 이용해 주세요.</p>
          </div>
          <div className='flex justify-center gap-3 pb-10 pt-7 pc:justify-start'>
            <Button
              variant='outline'
              className='h-14 w-32 border-2 border-[#3046EC] bg-white text-lg text-[#3046EC] hover:text-[#3046EC] pc:h-16 pc:w-[9.5rem] pc:text-[1.375rem]'
              onClick={() => router.back()}
            >
              이전 페이지
            </Button>
            <Button
              className='h-14 w-32 text-lg font-semibold pc:h-16 pc:w-[9.5rem] pc:text-[1.375rem]'
              onClick={() => router.push('/')}
            >
              처음 페이지
            </Button>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}

export { TimeoutPage }
