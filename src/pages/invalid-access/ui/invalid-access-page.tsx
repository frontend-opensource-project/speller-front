export const InvalidAccessPage = () => {
  return (
    <div className='flex w-full flex-col items-center px-4 py-10 text-base leading-[140%] tracking-[-0.02rem] tab:text-lg tab:tracking-[-0.0225rem] pc:py-16 pc:text-[1.375rem] pc:leading-[170%] pc:tracking-[-0.0275rem]'>
      <div className='flex w-full flex-col gap-8 pc:gap-10'>
        <div className='flex flex-col gap-2 text-center text-slate-500 dark:text-dark-text'>
          {/* 비정상 접근 안내 */}
          <p>
            <b>[비정상적인 접근 안내]</b>
          </p>
          <p>
            현재 접근하신 페이지는 &apos;바른한글(구 한국어 맞춤법/문법
            검사기)&apos;의 결과 페이지입니다.
          </p>
          <p>
            결과 페이지는 검사할 텍스트 입력이 있을 때만 생성되므로, 입력 없이
            직접 접근하시는 것은 정상적인 이용 방법이 아닙니다.
          </p>
          <p>
            바른한글을 이용하시려면 <a href='/speller'>메인 페이지</a>에서
            검사하고자 하는 텍스트를 입력해 주세요.
          </p>
          <br />
          <hr />
          <br />
          {/* 저작권 및 소개 */}
          <p>
            <b>[&apos;바른한글&apos; 소개]</b>
          </p>
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
        <div className='border-t border-slate-200 pt-2 text-center text-slate-400 dark:border-dark-border dark:text-dark-subtle'>
          Copyrightⓒ2001 AI Lab &amp; Narainfotech. All Rights Reserved
        </div>
      </div>
    </div>
  )
}
