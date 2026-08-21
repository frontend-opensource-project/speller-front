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
          alt='바른한글 첫 화면. 검사할 글을 붙여 넣는 원문 입력창과 검사하기 버튼'
        />
      </div>
      <div className='px-4 pc:container pc-lg:container pc:mx-auto pc:px-[4.5rem]'>
        <h2 className='pb-[1.875rem] pt-[4.375rem] text-center text-xl font-bold text-slate-400 dark:text-dark-subtle tab:text-3xl'>
          바른한글 사용법
        </h2>
        <div className='space-y-5'>
          <Image
            className='mx-auto'
            src='/guide/mo/guide1.png'
            width={604}
            height={862}
            alt='원문 입력창 위쪽의 강한 검사 켜기/끄기 스위치'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide2.png'
            width={604}
            height={1150}
            alt='검사 결과 화면. 왼쪽에 교정문, 오른쪽에 대치어와 도움말이 나란히 표시된다'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide3.png'
            width={604}
            height={575}
            alt='교정문에서 오류어 위에 뜬 대치어를 클릭해 바로 고치는 모습'
          />
          <Image
            className='mx-auto'
            src='/guide/mo/guide4.png'
            width={604}
            height={1150}
            alt='오른쪽 창에서 제안된 대치어를 직접 수정하는 모습'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide5.png'
            width={604}
            height={1150}
            alt='검사 결과 화면의 오류 제보 버튼'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide6.png'
            width={604}
            height={862}
            alt='의견을 남길 수 있는 문의하기 화면'
          />
        </div>
        <Image
          className='mx-auto mb-[4.5rem] tab:mb-[7.5rem]'
          src='/guide/mo/guide7.png'
          width={604}
          height={862}
          alt='이전 버전 사용하기 링크'
        />
      </div>
    </div>
  )
}
