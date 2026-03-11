'use client'

import { cn } from '../lib/tailwind-merge'
import { FooterGeniee } from './footer-geniee'

const Footer = () => {
  return (
    <>
      <FooterGeniee includeDevice={['mobile', 'tablet']} />
      <footer
        className={cn(
          'max-h-[14.5rem] bg-slate-200 dark:bg-dark-base tab:max-h-[17.4375rem] tab:min-h-[11.875rem] pc:mb-0 pc:max-h-[9.5rem] pc:min-h-[9.5rem]',
        )}
      >
        <div
          className={cn(
            'flex h-full flex-col items-center pc-lg:container pc:mx-auto pc:w-full pc:flex-row pc:justify-center pc:space-x-0 pc:px-[2.25rem] pc:py-2 pc-lg:space-x-0 pc-lg:px-[4.5rem]',
          )}
        >
          <FooterGeniee includeDevice={['desktop', 'desktop-large']} />
        </div>
      </footer>
    </>
  )
}

export { Footer }
