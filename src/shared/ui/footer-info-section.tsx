import Image from 'next/image'
import Link from 'next/link'

import { CONTACT_INFO } from '../model/contact-info'

const FooterInfoSection = () => {
  return (
    <div className='flex flex-col items-center gap-1 py-6 text-[0.625rem] pc:min-w-[24.0625rem] pc:items-start pc:py-0'>
      {/* 고객센터 섹션 */}
      <div className='flex gap-2 text-slate-600'>
        <span className='text-xs font-semibold leading-[1.0425rem] tracking-[-0.015rem] tab:leading-[1.05rem] pc:text-[0.75rem] pc:leading-[1.035rem] pc:tracking-[-0.015rem]'>
          <Link href='/order' className='hover:text-primary hover:underline'>
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
        <p className='pc:hidden'>바른 한글은 부산대학교 인공지능연구실과</p>
        <p className='pc:hidden'>(주)나라인포테크가 함께 만들고 있습니다.</p>
        {/* PC 버전 */}
        <p className='hidden pc:block'>
          바른 한글은 부산대학교 인공지능연구실과 (주)나라인포테크가 함께 만들고
          있습니다.
        </p>
        {/* 공통 텍스트 */}
        <p>이 검사기는 개인이나 학생만 무료로 사용할 수 있습니다.</p>
      </div>
      {/* 카피라이트 */}
      <div className='text-center text-[0.625rem] font-normal leading-[1.0625rem] tracking-[-0.0125rem] text-slate-500 tab:leading-[1.0625rem] pc:text-[0.75rem] pc:leading-[1.035rem] pc:tracking-[-0.015rem]'>
        Copyrightⓒ2001 AI Lab & Narainfotech. All Rights Reserved
      </div>
      <a
        href='https://rogue-toothpaste-2b9.notion.site/1ee8bd6bfd808016995ff0b71b2cb358'
        target='_blank'
        className='pt-1 text-xs text-primary hover:text-primary hover:underline pc:pt-2'
      >
        바른 한글 리뉴얼에 기여하신 분들
      </a>
    </div>
  )
}

export { FooterInfoSection }
