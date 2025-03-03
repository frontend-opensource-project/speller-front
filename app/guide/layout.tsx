import { Footer } from '@/shared/ui/footer'
import { Header } from '@/shared/ui/header'
import { FC, PropsWithChildren } from 'react'

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto] bg-white'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
