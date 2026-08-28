import { FC, PropsWithChildren } from 'react'

import { Footer } from '@/shared/ui/footer'
import { Header } from '@/shared/ui/header'

/**
 * 접속 제한 안내는 (base-layout) 을 거치지 않는다.
 * 차단된 방문자에게도 안내가 그대로 보여야 하므로 IP 확인(IpGuard)을 두지 않고,
 * 헤더와 푸터만 직접 넣는다.
 */
const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto] bg-background'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
