import React from 'react'
import { InfoCard } from './info-card'
import { SectionPanel } from './section-panel'
import { Button } from '@/shared/ui/button'
import Link from 'next/link'

export const OrderPage = () => {
  return (
    <>
      <div className='flex w-full flex-col'>
        <h1 className='my-3 text-3xl font-bold pc:mb-5 pc:mt-[3.6rem] pc:text-[3.125rem] pc:leading-[3.75rem]'>
          바른 한글 검사기 구매 안내
        </h1>
        <div className='mb-2 flex flex-col justify-between gap-2 pc:mb-[2.5rem] pc:flex-row'>
          <p className='text-base text-slate-400 pc:text-[1.375rem]'>
            바른 한글 검사기는 온라인 API와 오프라인 API 2가지 형태로 서비스를
            제공하고 있습니다.
            <br /> 금액이나 관련 문의는 하단의 구매 문의 부분을 참조하여주세요.
          </p>
          <a
            href='https://gdurl.com/fAjM'
            download
            className='inline-flex h-[2.75rem] w-fit items-center gap-2 rounded-full border border-[#ECEDF4] bg-[#FAFAFC] p-2 pr-3 text-slate-400 transition hover:bg-slate-300 hover:text-white'
          >
            <span className='flex size-[2rem] items-center justify-center rounded-full bg-slate-600'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M14.8532 10.311V13.3912C14.8532 13.7996 14.6909 14.1914 14.4021 14.4802C14.1132 14.769 13.7215 14.9313 13.313 14.9313H2.53229C2.12383 14.9313 1.7321 14.769 1.44327 14.4802C1.15445 14.1914 0.992188 13.7996 0.992188 13.3912V10.311M4.0724 6.46069L7.92267 10.311M7.92267 10.311L11.7729 6.46069M7.92267 10.311V1.07031'
                  stroke='white'
                  strokeWidth='1.54011'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </span>
            소개서 내려받기
          </a>
        </div>
        <div className='flex flex-col items-stretch gap-5 pc:flex-row'>
          <SectionPanel
            title='온라인 API'
            description='클라우드 서버를 이용한 API 서비스를 제공합니다.'
          >
            <InfoCard
              title='시범 서비스'
              description='시범 서비스 단계라 금액이나 관련 문의는 아래의 [구매 문의]로 연락 부탁드립니다.'
            />
          </SectionPanel>
          <SectionPanel
            title='오프라인용'
            description={
              <>
                개인용 제품은 판매하지 않습니다.
                <br />
                아래의 제품들은 기업용 발주만 제한적으로 가능합니다.
              </>
            }
          >
            <InfoCard
              title='한컴오피스 한글용 검사기'
              description='한컴오피스 2018 이후 제품에는 저희 검사기가 내장되어 있습니다.'
            />
            <InfoCard
              title='MS Word용 검사기'
              description='MS Office 365에서는 지원하지 않습니다.'
            />
            <InfoCard
              title='검사기 SDK(Software Development Kit)'
              description={
                <>
                  지원 OS: Windows, Linux(Ubuntu, RHEL 등), macOS, Android
                  <br />
                  지원 언어: C/C++, C#, PHP, Java, Python
                </>
              }
            />
          </SectionPanel>
        </div>
        <div className='flex items-center justify-center py-5 pc:py-10'>
          <Button
            size='lg'
            className='h-[3rem] text-xl pc:h-[4rem] pc:w-[9.5rem]'
          >
            <Link href='/'>돌아가기</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
