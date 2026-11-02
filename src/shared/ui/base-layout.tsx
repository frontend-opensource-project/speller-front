'use client'

import { FC, PropsWithChildren, useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { LONG_MODE_ENABLED } from '../config/feature'
import { ROUTES } from '../config/routes'
import { cn } from '../lib/tailwind-merge'
import { removeOverlayAd } from '../lib/geniee-ssp'
import { Header } from './header'
import { Footer } from './footer'
import { MainGeniee } from './main-geniee'

// 한 화면에 맞춰 그리고 하단 광고(푸터)를 두지 않는 페이지.
// 페이지 자체는 스크롤하지 않고 안쪽 영역이 스크롤한다
const FIT_SCREEN_PATHS: string[] = LONG_MODE_ENABLED
  ? [ROUTES.longResults.path]
  : []

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname()
  const isFitScreen = FIT_SCREEN_PATHS.includes(pathname ?? '')

  // 다른 페이지에서 띄운 하단 오버레이 광고가 남아 있으면 걷어 낸다
  useEffect(() => {
    if (isFitScreen) removeOverlayAd()
  }, [isFitScreen])

  return (
    <div
      className={cn(
        'grid min-h-screen grid-rows-[auto_1fr_auto] bg-slate-200 dark:bg-dark-base pc:bg-background',
        // 오른쪽 광고(160x600)가 잘리지 않는 높이보다 작아지면 그때만 페이지가 스크롤된다
        isFitScreen && 'h-dvh min-h-[45rem] grid-rows-[auto_minmax(0,1fr)]',
      )}
    >
      <Header />
      <div
        className={cn(
          'flex bg-background pc-lg:container pc:mx-auto pc:w-full pc:px-[2.25rem] pc-lg:px-[4.5rem]',
          isFitScreen && 'min-h-0',
        )}
      >
        {/* 레이아웃 쉬프트 방지 */}
        <div className='flex h-full flex-1'>{children}</div>
        {/* 광고 영역 */}
        <MainGeniee compact={isFitScreen} />
      </div>
      {!isFitScreen && <Footer />}
    </div>
  )
}

export { BaseLayout }
