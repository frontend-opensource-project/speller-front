import Image from 'next/image'
import Link from 'next/link'

import { CONTACT_INFO } from '../model/contact-info'
import { FooterAdSense } from './footer-ad-sense'

const Footer = () => {
  return (
    <footer className='bg-slate-200 pt-6 pc:py-[1.875rem]'>
      <div className='pc:container pc:mx-auto pc:px-[3.81rem]'>
        <div className='flex flex-col items-center justify-center tab:min-h-[90px] pc:flex-row pc:justify-between'>
          <div className='flex flex-col items-center gap-1 pb-4 text-[0.625rem] tab:pb-[4.8262rem] pc:items-start pc:pb-0'>
            {/* 고객센터 섹션 */}
            <div className='flex gap-2 text-slate-600'>
              <span className='text-xs font-semibold leading-[1.0425rem] tracking-[-0.015rem] tab:leading-[1.05rem] pc:text-[0.75rem] pc:leading-[1.035rem] pc:tracking-[-0.015rem]'>
                <Link
                  href='/order'
                  className='hover:text-primary hover:underline'
                >
                  구매문의
                </Link>
              </span>
              <a
                href={`tel:${CONTACT_INFO.tel.value}`}
                className='flex items-center gap-1 text-[0.6875rem] leading-[0.95563rem] tracking-[-0.01375rem] tab:leading-[0.9625rem] pc:text-[0.75rem] pc:leading-[1.035rem] pc:tracking-[-0.015rem]'
              >
                <div className='relative size-[0.83038rem]'>
                  <Image
                    className='object-cover'
                    src='/call.svg'
                    alt='call logo'
                    fill
                  />
                </div>
                <span>{CONTACT_INFO.tel.label}</span>
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email.value}`}
                className='flex items-center gap-1 text-[0.6875rem] leading-[0.95563rem] tracking-[-0.01375rem] tab:leading-[0.9625rem]'
              >
                <div className='relative mb-[0.05rem] size-[0.83038rem]'>
                  <Image
                    className='object-cover'
                    src='/email.svg'
                    alt='email logo'
                    fill
                  />
                </div>
                <span>{CONTACT_INFO.email.label}</span>
              </a>
            </div>
            {/* 저작권 정보 */}
            <div className='text-center text-[0.625rem] font-normal leading-[0.86875rem] tracking-[-0.0125rem] text-slate-500 tab:leading-[0.875rem] pc:text-start pc:text-[0.75rem] pc:leading-[1.035rem] pc:tracking-[-0.015rem]'>
              {/* 모바일 버전 */}
              <p className='pc:hidden'>
                바른 한글은 부산대학교 인공지능연구실과
              </p>
              <p className='pc:hidden'>
                (주)나라인포테크가 함께 만들고 있습니다.
              </p>
              {/* PC 버전 */}
              <p className='hidden pc:block'>
                바른 한글은 부산대학교 인공지능연구실과 (주)나라인포테크가 함께
                만들고 있습니다.
              </p>
              {/* 공통 텍스트 */}
              <p>이 검사기는 개인이나 학생만 무료로 사용할 수 있습니다.</p>
            </div>
            {/* 카피라이트 */}
            <div className='text-center text-[0.625rem] font-normal leading-[1.0625rem] tracking-[-0.0125rem] text-slate-500 tab:leading-[1.0625rem] pc:text-[0.75rem] pc:leading-[1.035rem] pc:tracking-[-0.015rem]'>
              Copyrightⓒ2001 AI Lab & Narainfotech. All Rights Reserved
            </div>
            <a
              href='#'
              className='text-xs text-slate-600 hover:text-primary hover:underline'
            >
              바른 한글 리뉴얼에 기여하신 분들
            </a>
          </div>
          {/* 광고 영역 */}
          <FooterAdSense />
        </div>
      </div>
    </footer>
  )
}

export { Footer }
