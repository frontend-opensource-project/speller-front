import { cn } from '../lib/tailwind-merge'
import { FooterAdSense } from './footer-ad-sense'
import { FooterInfoSection } from './footer-info-section'

const Footer = () => {
  return (
    <>
      <FooterAdSense includeDevice={['mobile', 'tablet']} />
      <footer
        className={cn(
          'max-h-[14.5rem] bg-slate-200 tab:max-h-[17.4375rem] tab:min-h-[11.875rem] pc:mb-0 pc:max-h-[9.5rem] pc:min-h-[9.5rem]',
        )}
      >
        <div className='flex h-full flex-col items-center pc:container pc-lg:container pc:mx-auto pc:flex-row pc:justify-between pc:space-x-7 pc:px-[2.25rem] pc:py-2 pc-lg:space-x-0 pc-lg:px-[4.5rem]'>
          <FooterInfoSection />
          <FooterAdSense includeDevice={['desktop', 'desktop-large']} />
        </div>
      </footer>
    </>
  )
}

export { Footer }
