import { FC, PropsWithChildren } from 'react'

import { Header } from './header'
import { Footer } from './footer'

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto] bg-slate-200 pc:bg-background'>
      <Header />
      <div className='flex bg-background pc-lg:container pc:mx-auto pc:w-full pc:px-[2.25rem] pc-lg:px-[4.5rem]'>
        <div className='flex h-full flex-1'>{children}</div>
      </div>
      <Footer />
    </div>
  )
}

export { BaseLayout }
