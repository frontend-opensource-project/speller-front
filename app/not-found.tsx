import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/shared/ui/footer'
import { Header } from '@/shared/ui/header'
import { ROUTES } from '@/shared/config'

// robots 는 지정하지 않는다. Next 가 404 응답에 noindex 를 자동으로 넣는다.
export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
}

const LINKS = [
  { label: '맞춤법 검사하기', route: ROUTES.speller },
  { label: '사용법', route: ROUTES.guide },
  { label: '묻고 답하기', route: ROUTES.qaBoard },
  { label: '문의하기', route: ROUTES.feedback },
]

/**
 * 404 화면.
 *
 * @description
 * 루트 not-found 는 (base-layout) 같은 하위 레이아웃을 거치지 않으므로
 * 헤더와 푸터를 직접 넣는다.
 */
const NotFound = () => {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto] bg-white dark:bg-dark-base'>
      <Header />
      <main className='flex flex-col items-center justify-center px-6 py-20 text-center'>
        <p className='text-5xl font-bold text-primary tab:text-6xl'>404</p>
        <h1 className='mt-6 text-xl font-semibold text-slate-600 dark:text-dark-text tab:text-2xl'>
          페이지를 찾을 수 없습니다
        </h1>
        <p className='mt-3 text-base leading-[160%] text-slate-500 dark:text-dark-subtle tab:text-lg'>
          주소가 바뀌었거나 삭제된 페이지입니다.
          <br />
          아래에서 원하시는 곳으로 이동해 주세요.
        </p>
        <nav className='mt-10 flex flex-wrap items-center justify-center gap-3'>
          {LINKS.map(({ label, route }) => (
            <Link
              key={route.path}
              href={route.path}
              className='rounded-lg border border-slate-200 px-4 py-3 font-semibold !leading-none text-slate-600 hover:bg-accent dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-elevated'
            >
              {label}
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
