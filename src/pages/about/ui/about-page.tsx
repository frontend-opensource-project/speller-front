import { CONTACT_INFO } from '@/shared/model/contact-info'
import Image from 'next/image'
import Link from 'next/link'

export const AboutPage = () => {
  return (
    <div className='flex min-h-[calc(100vh-8rem)] w-full flex-col items-center px-4 py-10 pc:py-16'>
      <div className='flex w-full max-w-[32rem] flex-col gap-8 pc:gap-10'>
        {/* 상단: 기여자 안내 */}
        <div className='flex flex-col items-center gap-2'>
          <a
            href='https://rogue-toothpaste-2b9.notion.site/1ee8bd6bfd808016995ff0b71b2cb358'
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs font-semibold text-primary hover:underline'
          >
            바른 한글 재단장에 기여하신 분들
          </a>
        </div>

        {/* 고객센터 및 문의 */}
        <div className='flex flex-col items-center gap-3 rounded-lg bg-slate-100 p-4 pc:flex-row pc:justify-center'>
          <div className='flex flex-col items-center gap-1 pc:flex-row pc:justify-center'>
            <span className='text-xs font-semibold tracking-[-0.015rem] pc:text-sm'>
              <Link
                href='/order'
                className='hover:text-primary hover:underline'
              >
                구매문의
              </Link>
            </span>
            <a
              href={`tel:${CONTACT_INFO.tel.value}`}
              className='text-slate-700 flex items-center gap-1 text-xs hover:text-primary'
            >
              <div className='relative size-4'>
                <Image
                  className='object-cover'
                  src='/call.svg'
                  alt='전화 아이콘'
                  fill
                />
              </div>
              <span>{CONTACT_INFO.tel.label}</span>
            </a>
            <a
              href={`mailto:${CONTACT_INFO.email.value}`}
              className='text-slate-700 flex items-center gap-1 text-xs hover:text-primary'
            >
              <div className='relative size-4'>
                <Image
                  className='object-cover'
                  src='/email.svg'
                  alt='이메일 아이콘'
                  fill
                />
              </div>
              <span>{CONTACT_INFO.email.label}</span>
            </a>
          </div>
        </div>

        {/* 저작권 및 소개 */}
        <div className='flex flex-col gap-2 text-center text-xs text-slate-500 pc:text-sm'>
          {/* PC/모바일 반응형 소개 */}
          <div>
            <p className='pc:hidden'>바른 한글은 부산대학교 인공지능연구실과</p>
            <p className='pc:hidden'>
              (주)나라인포테크가 함께 만들고 있습니다.
            </p>
            <p className='hidden pc:block'>
              바른 한글은 부산대학교 인공지능연구실과 (주)나라인포테크가 함께
              만들고 있습니다.
            </p>
          </div>
          <p>이 검사기는 개인이나 학생만 무료로 사용할 수 있습니다.</p>
        </div>

        {/* 카피라이트 */}
        <div className='border-t border-slate-200 pt-2 text-center text-[0.7rem] text-slate-400'>
          Copyrightⓒ2001 AI Lab &amp; Narainfotech. All Rights Reserved
        </div>
      </div>
    </div>
  )
}
