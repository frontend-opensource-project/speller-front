'use client'

export const AdsTestPage = () => {
  return (
    <>
      <div className='flex w-full flex-col items-center px-4 py-10 text-base leading-[140%] tracking-[-0.02rem] tab:text-lg tab:tracking-[-0.0225rem] pc:py-16 pc:text-[1.375rem] pc:leading-[170%] pc:tracking-[-0.0275rem]'>
        <div className='flex w-full flex-col gap-8 pc:gap-10'>
          <div className='flex flex-col items-center gap-2'>
            <p>이 페이지는 광고 테스트를 위한 전용 페이지입니다.</p>
          </div>

          {/* 저작권 및 소개 */}
          <div className='flex flex-col gap-2 text-center text-slate-500'>
            {/* PC/모바일 반응형 소개 */}
            <p>
              &apos;바른한글&apos;은 &apos;한국어 맞춤법/문법 검사기&apos;의 새
              이름입니다.
            </p>
            <p>
              &apos;한국어 맞춤법/문법 검사기&apos;는 인공지능연구실과
              (주)나라인포테크가 함께 만들었으며, <br />
              현재는 &apos;바른한글&apos;로 이름을 변경하고 (주)나라인포테크에서
              운영하고 있습니다.
            </p>
            <p>이 검사기는 개인이나 학생만 무료로 사용할 수 있습니다.</p>
          </div>

          {/* 카피라이트 */}
          <div className='border-t border-slate-200 pt-2 text-center text-slate-400'>
            Copyrightⓒ2001 AI Lab &amp; Narainfotech. All Rights Reserved
          </div>
        </div>
      </div>
    </>
  )
}
