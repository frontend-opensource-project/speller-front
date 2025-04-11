import { FC, PropsWithChildren } from 'react'
import GoogleAdSense from '../lib/google-ad-sense'
import { Header } from './header'
import { Footer } from './footer'

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto] bg-background'>
      <Header />
      <div className='flex bg-background pc:container pc:mx-auto pc:px-[4.5rem]'>
        {/* 레이아웃 쉬프트 방지 */}
        <div className='flex h-full flex-1'>{children}</div>
        {/* 광고 영역 */}
        <div className='my-24 hidden rounded-md bg-slate-300 pc:ml-5 pc:block'>
          <GoogleAdSense
            className='h-[37.5rem] w-40 place-content-center'
            data-ad-slot='9725653724'
            data-full-width-responsive='true'
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export { BaseLayout }
