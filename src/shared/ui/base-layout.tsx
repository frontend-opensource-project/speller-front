import { FC, PropsWithChildren } from 'react'

import { Header } from './header'
import { Footer } from './footer'
import { MainGeniee } from './main-geniee'
import { useGenieeAdClient } from '../lib/geniee-ssp'

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  // Geniee 광고 시스템 전역 초기화 (한 번만 수행)
  useGenieeAdClient()
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto] bg-slate-200 pc:bg-background'>
      <Header />
      <div className='flex bg-background pc-lg:container pc:mx-auto pc:w-full pc:px-[2.25rem] pc-lg:px-[4.5rem]'>
        {/* 레이아웃 쉬프트 방지 */}
        <div className='flex h-full flex-1'>{children}</div>
        {/* 광고 영역 */}
        <MainGeniee />
      </div>
      <Footer />
    </div>
  )
}

export { BaseLayout }
