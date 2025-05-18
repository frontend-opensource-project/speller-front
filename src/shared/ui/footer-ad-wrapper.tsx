'use client'

import { cn } from '@/shared/lib/tailwind-merge'
import { useAdContext } from '../model/ad-context'
import { FooterAdSense } from './footer-ad-sense'

const isDev = process.env.NODE_ENV === 'development'

const FooterAdWrapper = ({ children }: { children: React.ReactNode }) => {
  const { adState } = useAdContext()
  // 광고게시 준비가 되었으나 게시할 광고가 없는경우
  const isAdUnFilledStatus = !adState.isLoading && !adState.isAdFilled

  return (
    <footer
      className={cn(
        'mb-[6.25rem] max-h-[14.5rem] bg-slate-200 tab:max-h-[17.4375rem] pc:mb-0 pc:max-h-[9.5rem] pc:min-h-[9.5rem]',
        isAdUnFilledStatus && 'mb-0',
        isDev && 'mb-[6.25rem]',
      )}
    >
      <div className='flex h-full flex-col items-center pc:container pc-lg:container pc:mx-auto pc:flex-row pc:justify-between pc:space-x-7 pc:px-[2.25rem] pc:py-2 pc-lg:space-x-0 pc-lg:px-[4.5rem]'>
        {children}
        <FooterAdSense />
      </div>
    </footer>
  )
}

export { FooterAdWrapper }
