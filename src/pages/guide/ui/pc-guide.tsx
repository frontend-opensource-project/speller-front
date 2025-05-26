import Image from 'next/image'
import React from 'react'

export const PcGuide = () => {
  return (
    <div className='hidden pc:block'>
      <Image
        className='mx-auto'
        src='/guide/pc/top.png'
        width={1920}
        height={1200}
        alt='누구나 제한 없이 전문적인 맞춤법을 사용해요.'
      />
      <div className='px-4 pc:container pc-lg:container pc:mx-auto pc:px-[4.5rem]'>
        <h2 className='pb-[1.875rem] pt-[4.375rem] text-center text-3xl font-bold text-slate-400'>
          바른 한글 사용법
        </h2>
        <div className='space-y-5'>
          <Image
            className='mx-auto'
            src='/guide/pc/guide1.png'
            width={1104}
            height={952}
            alt='정확도 높은 검사 결과를 원할 시 강한 검사를 체크하세요.'
          />

          <Image
            className='mx-auto'
            src='/guide/pc/guide2.png'
            width={1104}
            height={952}
            alt='좌측에서 교정된 문서를 확인하고 우측에서 오류 수정할 수 있어요.'
          />

          <div className='mx-auto hidden justify-center space-x-5 pc:flex'>
            <Image
              src='/guide/pc/guide3.png'
              width={541}
              height={952}
              alt='오류어 위 대치어를 클릭하여 빠르게 교정하세요.'
            />

            <Image
              src='/guide/pc/guide4.png'
              width={541}
              height={952}
              alt='대치어를 직접 수정할 수 있어요.'
            />
          </div>

          <Image
            className='mx-auto'
            src='/guide/pc/guide5.png'
            width={1104}
            height={952}
            alt='교정문에서 오류를 발견하면 오류 제보를 통해 알려주세요.'
          />

          <Image
            className='mx-auto'
            src='/guide/pc/guide6.png'
            width={1104}
            height={952}
            alt='맞춤법 검사기에 대한 의견을 남겨주세요.'
          />
        </div>
      </div>
      <Image
        className='mx-auto'
        src='/guide/pc/guide7.png'
        width={1920}
        height={680}
        alt='이전 버전이 익숙한 분들을 위해 기존 검사기도 계속 제공됩니다.'
      />
    </div>
  )
}
