import { FC, PropsWithChildren } from 'react'

import { Header } from './header'
import { Footer } from './footer'
import { MainAdSense } from './main-ad-sense'

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto] bg-slate-200 pc:bg-background'>
      <Header />
      <div className='flex bg-background pc:container pc-lg:container pc:mx-auto pc:px-[2.25rem] pc-lg:px-[4.5rem]'>
        {/* 레이아웃 쉬프트 방지 */}
        <div className='flex h-full flex-1'>{children}</div>
        {/* 광고 영역 */}
        <MainAdSense />
      </div>
      <Footer />
    </div>
  )
}

export { BaseLayout }
