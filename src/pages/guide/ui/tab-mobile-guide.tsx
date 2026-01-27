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
          alt='맞춤법/문법 검사를 하려면, 사용자가 작성한 글을 복사해서 바른한글 사이트에 처음 뜨는 창에 붙여 넣고, 아래쪽에 있는 ‘검사하기’ 버튼을 누르면 됩니다. 단순한 오자나 탈자는 물론이고 문맥(context)에서 틀린 표현을 찾아주는 기능이 뛰어나다는 것이 업계의 평판이다. 따라서 대한민국의  정부기관(교육부, 법원도서관 등), 주요 언론사 (JTBC, MBC, SBS, KBS 등)와 취업 사이트 (사람인) 등이 바른한글의 한국어 맞춤법/문법 검사 기술을 채택해 사용하고 있다. 개인 사용자에게 중요한 장점으로는, 바른한글을 이용할 때 회원가입을 통한 개인정보 요구를 하지 않는다는 점이다. 영리를 목적으로 하지 않는 이용자라면 온라인으로 접속해 이용하면 된다. 이용자가 입력한 글의 내용은 검사를 마치면 삭제되며, 서버에 남지 않아 이용자의 개인정보 유출 우려가 원천적으로 차단된다. 검사하려는 글에는 개인정보나 민감한 내용이 담길 때가 많기 때문에 이용자의 글 내용이나 정보를 수집해 활용하는 건 윤리적 문제가 있다는 것이 개발 책임자인 권혁철 교수의 생각이다. 다만 검사하는 글에서 발견된 오자와 탈자를 기준으로 앞뒤 일곱 단어는 남겨두는데, 이는 제대로 검사가 이뤄졌는지 확인하고 검사기 기능을 개선하기 위한 것이라고 설명한다.'
        />
      </div>
      <div className='px-4 pc:container pc-lg:container pc:mx-auto pc:px-[4.5rem]'>
        <h2 className='pb-[1.875rem] pt-[4.375rem] text-center text-xl font-bold text-slate-400 tab:text-3xl'>
          바른한글 사용법
        </h2>
        <div className='space-y-5'>
          <Image
            className='mx-auto'
            src='/guide/mo/guide1.png'
            width={604}
            height={862}
            alt='정확도 높은 검사 결과를 원할 시 강한 검사를 체크하세요. 권혁철 교수가 한국어 맞춤법/문법 검사기를 만든 사실이 알려져, 이용자들 사이에선 ‘부산대 맞춤법 검사기’로도 불린다. 검사기의 유지와 관리는 권 교수가 설립한 벤처 기업인 ㈜나라인포테크가 맡고 있다. ㈜나라인포테크에서는 국어학 전공자와 엔지니어 등 직원 8명이 일한다. 최근 언어공학자로 지난 30여 년 권혁철 교수와 공동연구를 해 왔던 부산대학교 윤애선 교수도 합류했다. 하루 평균 5만 명의 이용자가 바른한글 사이트에 접속하며, 한 달 평균 검사량은 1,200만 건에 달한다.'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide2.png'
            width={604}
            height={1150}
            alt='처음 뜨는 창에 원문을 입력하고 ‘검사하기’ 버튼을 누르면, 다음으로 넘어가면서 2개의 창이 나타납니다.  좌측에서 교정된 문서를 확인하고, 오류가 있다면 우측에 오류를 교정할 대치어가 나타나고, 그 근거를 도움말에서 볼 수 있어요.'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide3.png'
            width={604}
            height={575}
            alt='대치어가 올바르다면 왼쪽 창에서는 바로 오류어 위에 출력된 대치어를 클릭하여 빠르게 교정할 수도 있어요. 다른 대치어가 궁금하다면 오른쪽 창에서 볼 수 있고, 다른 대치어가 맞다면 그것을 클릭하세요.'
          />
          <Image
            className='mx-auto'
            src='/guide/mo/guide4.png'
            width={604}
            height={1150}
            alt='검사기가 제안한 대치어에 수정이 필요하다면 오른쪽 창에서 대치어를 직접 수정할 수 있어요.'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide5.png'
            width={604}
            height={1150}
            alt='검사기가 제안한 교정문에서 오류를 발견하면, ‘오류 제보’를 통해 알려주세요. 사용자 각자의 글에서 발견되는 구체적인 오류를 알려주시면 바른한글의 기능을 개선하는 데 큰 도움이 됩니다.'
          />

          <Image
            className='mx-auto'
            src='/guide/mo/guide6.png'
            width={604}
            height={862}
            alt='바른한글 (구, 한국어 맞춤법/문법 검사기)에 대한 의견을 남겨주세요.'
          />
        </div>
        <Image
          className='mx-auto mb-[4.5rem] tab:mb-[7.5rem]'
          src='/guide/mo/guide7.png'
          width={604}
          height={862}
          alt='새로운 사용자 인터페이스보다 이전 버전이 익숙한 분들을 위해 바른한글 (구, 한국어 맞춤법/문법 검사기) 기존 버전도 계속 제공됩니다.'
        />
      </div>
    </div>
  )
}
