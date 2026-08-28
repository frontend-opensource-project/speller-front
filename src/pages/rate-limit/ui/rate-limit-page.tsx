import { FC, PropsWithChildren } from 'react'
import Link from 'next/link'

import { ROUTES } from '@/shared/config'

/**
 * 안내 문구를 묶어 두는 박스. 왼쪽 선으로 본문과 구분한다.
 */
const Notice: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <div className='mt-6 rounded-xl border-l-4 border-primary bg-slate-100 p-5 text-left dark:bg-dark-elevated'>
    <p className='mb-3 font-semibold text-slate-600 dark:text-dark-text tab:text-lg'>
      {title}
    </p>
    <ul className='list-disc space-y-2 pl-[1.125rem] text-slate-500 dark:text-dark-subtle'>
      {children}
    </ul>
  </div>
)

/**
 * Cloudflare 속도 제한(Rate limiting) 규칙에 걸린 방문자에게 보여 주는 안내 화면.
 *
 * @description
 * Cloudflare 규칙의 응답을 이 경로로 보내서 쓴다.
 * 규칙의 대상 경로에서 이 경로는 빼 두어야 안내 화면까지 함께 막히지 않는다.
 */
const RateLimitPage = () => {
  return (
    <main className='flex justify-center px-4 pb-12 pt-6 tab:px-[3.75rem] tab:pb-16 tab:pt-10'>
      <section className='w-full max-w-[46rem] break-keep rounded-[1rem] bg-white px-6 pb-8 pt-10 text-center dark:bg-dark-surface tab:px-12 tab:pb-12 tab:pt-14 pc:max-w-[56rem] pc:px-14 pc-lg:max-w-[64rem]'>
        <div
          className='mx-auto mb-6 flex size-[4.5rem] items-center justify-center rounded-full bg-primary/10 text-primary'
          aria-hidden='true'
        >
          <svg
            className='size-9'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.8'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='9' />
            <path d='M12 7v5l3.5 2' />
          </svg>
        </div>

        <h1 className='text-2xl font-semibold leading-[140%] tracking-[-0.03rem] text-slate-600 dark:text-dark-text tab:text-3xl pc:text-4xl'>
          일시적으로 접속이 제한되었습니다.
        </h1>
        <p className='mt-2 font-medium text-primary'>[ 과도한 요청 감지 ]</p>

        <div className='mt-7 space-y-3.5 text-left leading-[170%] text-slate-500 dark:text-dark-subtle tab:text-lg'>
          <p>
            바른한글은 검사 서비스를 안정적으로 제공하기 위해, 짧은 시간 동안
            같은 IP 주소에서 검사 결과 페이지 요청이 지나치게 많이 들어오면 자동
            수집(크롤링)으로 판단해 해당 IP의 접속을 잠시 제한하고 있습니다.
          </p>
          <p>
            다만 이 판단은 IP 주소와 요청 횟수만을 기준으로 하기 때문에,
            공유기나 회사·학교·공용 와이파이처럼 여러 사람이 하나의 IP를 함께
            쓰는 환경에서는 각자의 요청이 한꺼번에 합산됩니다. 그래서 짧은
            시간에 여러 사람이 동시에 검사하거나, 결과 페이지를 반복해서
            새로고침한 경우에도 제한이 걸릴 수 있습니다.
          </p>
          <p>
            정상적으로 이용하시던 중에 이 페이지를 보게 되셨다면, 불편을 끼쳐
            드린 점 진심으로 사과드립니다.
          </p>
        </div>

        <Notice title='이용 안내'>
          <li>
            별도의 신청이나 문의 없이{' '}
            <strong className='font-semibold text-slate-600 dark:text-dark-text'>
              약 15분 후 자동으로 해제
            </strong>
            되며, 이후에는 평소와 같이 이용하실 수 있습니다.
          </li>
          <li>
            해제 전까지는 새로고침을 반복해도 더 빨리 풀리지 않습니다. 잠시
            기다렸다가 다시 방문해 주세요.
          </li>
          <li>
            입력하신 문장은 서버에 저장되지 않으니, 검사할 내용은 미리 복사해
            두시길 권해 드립니다.
          </li>
          <li>
            15분이 지난 뒤에도 이 페이지가 계속 나타난다면{' '}
            <Link href={ROUTES.feedback.path} className={classes.link}>
              문의하기
            </Link>
            로 알려 주시면 확인해 드리겠습니다.
          </li>
        </Notice>

        <Notice title='기관·기업에서 이용 중이시라면'>
          <li>
            학교 등 교육기관에서 비상업적인 목적으로 검사기 화면에서 직접
            이용하고 계신다면,{' '}
            <Link href={ROUTES.feedback.path} className={classes.link}>
              문의하기
            </Link>
            를 통해 기관과 이용 환경을 알려 주세요. 해당 네트워크가 차단되지
            않도록 따로 도와 드리겠습니다.
          </li>
          <li>
            회사 업무 등 상업적인 목적으로 이용하고 계신다면,{' '}
            <Link href={ROUTES.order.path} className={classes.link}>
              구매 문의
            </Link>{' '}
            안내를 참고하신 뒤 연락 주시기 바랍니다. 사용 환경에 맞는 이용
            방법을 안내해 드리겠습니다.
          </li>
        </Notice>

        <div className='mt-8 flex flex-wrap justify-center gap-3'>
          <Link
            href={ROUTES.speller.path}
            className={`${classes.button} border-primary bg-primary text-white hover:border-blue-400 hover:bg-blue-400`}
          >
            처음으로
          </Link>
          <Link
            href={ROUTES.feedback.path}
            className={`${classes.button} border-primary text-primary hover:bg-primary/10`}
          >
            문의하기
          </Link>
        </div>
      </section>
    </main>
  )
}

const classes = {
  link: 'font-semibold text-primary underline underline-offset-2 hover:text-blue-400',
  button:
    'inline-flex h-14 min-w-[9.5rem] items-center justify-center rounded-lg border-2 px-6 text-lg font-semibold transition-colors pc:h-16 pc:text-[1.375rem]',
}

export { RateLimitPage }
