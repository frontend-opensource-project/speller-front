import { Footer } from '@/shared/ui/footer'
import { Header } from '@/shared/ui/header'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto] bg-white'>
      <Header />
      <div className='flex bg-white px-6 pc:container pc-lg:container tab:px-[3.75rem] pc:mx-auto pc:px-[3.5rem]'>
        {/* 레이아웃 쉬프트 방지 */}
        <div className='flex h-full flex-1'>{children}</div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
