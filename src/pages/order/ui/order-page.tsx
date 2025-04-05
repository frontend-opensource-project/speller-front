import React from 'react'
import { InfoCard } from './info-card'
import { SectionPanel } from './section-panel'
import { CONTACT_INFO } from '@/shared/model/contact-info'

export const OrderPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-4 py-[5rem]'>
      <div className='flex w-[98.25rem] flex-col'>
        <h1 className='mb-5 text-[4rem] font-bold'>
          바른 한글 검사기 구매 안내
        </h1>
        <div className='mb-[2.5rem] flex flex-col justify-between pc:flex-row'>
          <p className='text-2xl text-slate-400'>
            바른 한글 검사기는 온라인 API와 오프라인 API 2가지 형태로 서비스를
            제공하고 있습니다.
            <br /> 금액이나 관련 문의는 하단의 구매 문의 부분을 참조하여주세요.
          </p>
          <a
            href='https://gdurl.com/fAjM'
            download
            className='inline-flex h-[4rem] w-fit items-center gap-[0.625rem] rounded-full border border-[#ECEDF4] bg-[#FAFAFC] px-4 py-2 text-2xl text-slate-400'
          >
            <span className='flex size-[3rem] items-center justify-center rounded-full bg-slate-600'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='23'
                height='22'
                viewBox='0 0 23 22'
                fill='none'
              >
                <path
                  d='M21.027 14.2745V18.6381C21.027 19.2168 20.7971 19.7717 20.3879 20.1809C19.9788 20.5901 19.4238 20.82 18.8452 20.82H3.57244C2.99379 20.82 2.43883 20.5901 2.02966 20.1809C1.62049 19.7717 1.39063 19.2168 1.39062 18.6381V14.2745M5.75426 8.81996L11.2088 14.2745M11.2088 14.2745L16.6634 8.81996M11.2088 14.2745V1.18359'
                  stroke='white'
                  strokeWidth='2.18182'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </span>
            소개서 내려받기
          </a>
        </div>
        <div className='mb-5 flex flex-col gap-5 pc:flex-row'>
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
        <div className='flex h-[166px] w-full flex-col items-center justify-center rounded-[1rem] bg-primary text-white'>
          <h3 className='text-[1.5rem] font-semibold leading-[2.4rem]'>
            구매 문의
          </h3>
          <div className='text-center text-xl'>
            <a href={`mailto:${CONTACT_INFO.email.value}`}>
              {CONTACT_INFO.email.label} ({CONTACT_INFO.email.value})
            </a>{' '}
            <br />
            <a href={`tel:${CONTACT_INFO.tel.value}`}>
              {CONTACT_INFO.tel.label} ({CONTACT_INFO.tel.value})
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
