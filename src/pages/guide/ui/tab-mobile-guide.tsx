import React from 'react'
import Image from 'next/image'

export const TabMobileGuide = () => {
  return (
    <div className='pc:hidden'>
      <div className='relative w-full pb-[133.92%]'>
        <Image
          src='/guide/mo/top.png'
          fill
          className='object-contain'
          alt='누구나 제한 없이 전문적인 맞춤법을 사용해요.'
        />
      </div>
      <div className='px-4 pc:container pc-lg:container pc:mx-auto pc:px-[4.5rem]'>
        <h2 className='pb-[1.875rem] pt-[4.375rem] text-center text-xl font-bold text-slate-400 tab:text-3xl'>
          바른 한글 사용법
        </h2>
        <div className='space-y-5'>
          <Image
            className='mx-auto'
            src='/guide/mo/guide1.png'
            width={604}
            height={862}
            alt='정확도 높은 검사 결과를 원할 시 강한 검사를 체크하세요.'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide2.png'
            width={604}
            height={1150}
            alt='좌측에서 교정된 문서를 확인하고 우측에서 오류 수정할 수 있어요.'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide3.png'
            width={604}
            height={575}
            alt='오류어 위 대치어를 클릭하여 빠르게 교정하세요.'
          />
          <Image
            className='mx-auto'
            src='/guide/mo/guide4.png'
            width={604}
            height={1150}
            alt='대치어를 직접 수정할 수 있어요.'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide5.png'
            width={604}
            height={1150}
            alt='교정문에서 오류를 발견하면 오류 제보를 통해 알려주세요.'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide6.png'
            width={604}
            height={862}
            alt='맞춤법 검사기에 대한 의견을 남겨주세요.'
          />
        </div>
        <Image
          className='mx-auto mb-[4.5rem] tab:mb-[7.5rem]'
          src='/guide/mo/guide7.png'
          width={604}
          height={862}
          alt='이전 버전이 익숙한 분들을 위해 기존 검사기도 계속 제공됩니다.'
        />
      </div>
    </div>
  )
}
