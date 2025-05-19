const AccessDeniedMessage = () => (
  <div className='flex h-screen items-center justify-center'>
    <div className='text-lg tab:text-xl pc:text-2xl'>
      <div className='text-center font-bold'>
        <h1>ACCESS DENIED</h1>
        <h1>현재 접속이 제한된 IP 주소입니다.</h1>
      </div>
      <br />
      <p>바른 한글은 상용 프로그램입니다.</p>
      <p>웹검사기는 개인 용도로 사용할 수 있게 편의를 제공하는 것입니다.</p>
      <p>최근 웹검사기를 허락 없이 다른 응용프로그램에서 사용하거나,</p>
      <p>기업에서 이용하는 사례가 발견되어 개선하는 중입니다.</p>
      <p>불편을 끼쳐 죄송합니다.</p>
      <br />
      <p>아래에 해당하는데 사용이 안 된다면, 문의해 주십시오.</p>
      <p>- 가정이나 PC방 등에서 사용하는 개인</p>
      <p>- 대법원도서관, 조선일보, 특허청, SBS</p>
      <br />
      <p>
        (문의:{' '}
        {
          <a href='tel:051-516-9268' className='underline'>
            051-516-9268
          </a>
        }
        ,{' '}
        {
          <a href='mailto:urimal@pusan.ac.kr' className='underline'>
            urimal@pusan.ac.kr
          </a>
        }
        )
      </p>
    </div>
  </div>
)

const IpCheckingFallback = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='animate-pulse text-center text-lg tab:text-xl pc:text-2xl'>
        <div className='mb-2 font-bold'>
          <h1>접속 상태 확인 중...</h1>
        </div>
        <p className='text-slate-500'>사용자 IP 확인 중입니다.</p>
        <p className='mt-2 text-sm text-slate-400'>잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}

export { AccessDeniedMessage, IpCheckingFallback }
