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
        alt='바른한글 첫 화면. 검사할 글을 붙여 넣는 원문 입력창과 검사하기 버튼'
      />
      <div className='px-4 pc:container pc-lg:container pc:mx-auto pc:px-[4.5rem]'>
        <h2 className='pb-[1.875rem] pt-[4.375rem] text-center text-3xl font-bold text-slate-400 dark:text-dark-subtle'>
          바른한글 사용법
        </h2>
        <div className='space-y-5'>
          <Image
            className='mx-auto'
            src='/guide/pc/guide1.png'
            width={1104}
            height={952}
            alt='원문 입력창 위쪽의 강한 검사 켜기/끄기 스위치'
          />

          <Image
            className='mx-auto'
            src='/guide/pc/guide2.png'
            width={1104}
            height={952}
            alt='검사 결과 화면. 왼쪽에 교정문, 오른쪽에 대치어와 도움말이 나란히 표시된다'
          />

          <div className='mx-auto hidden justify-center space-x-5 pc:flex'>
            <Image
              src='/guide/pc/guide3.png'
              width={541}
              height={952}
              alt='교정문에서 오류어 위에 뜬 대치어를 클릭해 바로 고치는 모습'
            />

            <Image
              src='/guide/pc/guide4.png'
              width={541}
              height={952}
              alt='오른쪽 창에서 제안된 대치어를 직접 수정하는 모습'
            />
          </div>

          <Image
            className='mx-auto'
            src='/guide/pc/guide5.png'
            width={1104}
            height={952}
            alt='검사 결과 화면의 오류 제보 버튼'
          />

          <Image
            className='mx-auto'
            src='/guide/pc/guide6.png'
            width={1104}
            height={952}
            alt='의견을 남길 수 있는 문의하기 화면'
          />
        </div>
      </div>
      <Image
        className='mx-auto'
        src='/guide/pc/guide7.png'
        width={1920}
        height={680}
        alt='이전 버전 사용하기 링크'
      />
    </div>
  )
}
