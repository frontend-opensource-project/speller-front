'use client'

import { useEffect } from 'react'
import { useBreakpoint } from '../../../shared/lib/use-break-point'

const GenieeAdComponent = () => {
  const breakpoint = useBreakpoint()

  useEffect(() => {
    const SCRIPT_URL = 'https://cpt.geniee.jp/hb/v1/223680/3011/wrapper.min.js'
    const OVERLAY_ID = '1597526_nara-speller.co.kr_overlay'
    const BANNER_ID_160x600 =
      '1597525_nara-speller.co.kr_standardbanner_160x600'
    const BANNER_ID_729x90 = '1598714_nara-speller.co.kr_standardbanner_729x90'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any
    win.gnshbrequest = win.gnshbrequest || { cmd: [] }

    // 2. 핵심 스크립트가 이미 로드되었는지 확인하고, 없으면 한 번만 로드
    const scriptExists = Array.from(
      document.getElementsByTagName('script'),
    ).some(script => script.src === SCRIPT_URL)
    if (!scriptExists) {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      document.body.appendChild(script)
    }

    // 3. 각 광고 슬롯에 대한 요청을 큐에 추가
    // 오버레이 광고는 항상 요청
    win.gnshbrequest.cmd.push(function () {
      win.gnshbrequest.applyPassback(OVERLAY_ID, `[data-cptid='${OVERLAY_ID}']`)
    })

    // 배너 광고 요청
    if (breakpoint != 'mobile') {
      win.gnshbrequest.cmd.push(function () {
        win.gnshbrequest.forceInternalRequest()
        win.gnshbrequest.applyPassback(
          BANNER_ID_160x600,
          `[data-cptid='${BANNER_ID_160x600}']`,
        )
      })
    } else {
      win.gnshbrequest.cmd.push(function () {
        win.gnshbrequest.forceInternalRequest()
        win.gnshbrequest.applyPassback(
          BANNER_ID_729x90,
          `[data-cptid='${BANNER_ID_729x90}']`,
        )
      })
    }
  }, [breakpoint]) // []는 이 useEffect가 컴포넌트 마운트 시 한 번만 실행되도록 보장

  return (
    <>
      {/* React는 렌더링을 담당하고, 실제 광고 로직은 useEffect에서 처리합니다.
        JSX에서는 주석을 이와 같이 작성해야 합니다.
      */}

      {/* 표준 배너 광고를 위한 플레이스홀더 div */}
      {breakpoint != 'mobile' ? (
        <>
          <div
            data-cptid='1597525_nara-speller.co.kr_standardbanner_160x600'
            style={{ display: 'block' }}
          ></div>
        </>
      ) : (
        <>
          <div
            data-cptid='1598714_nara-speller.co.kr_standardbanner_729x90'
            style={{ display: 'block' }}
          ></div>
        </>
      )}

      {/* 오버레이 광고를 위한 플레이스홀더 div */}
      <div data-cptid='1597526_nara-speller.co.kr_overlay'></div>
    </>
  )
}

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
      <GenieeAdComponent />
    </>
  )
}
