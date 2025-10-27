import 'overlayscrollbars/overlayscrollbars.css'
import './styles/globals.css'

import localFont from 'next/font/local'

import { Toaster } from '@/shared/ui/toaster'
import { GoogleAnalyticsScript } from '@/shared/lib/google-analytics-script'
import { GenieeProvider } from '@/shared/ui/geniee-provider'

const pretendard = localFont({
  src: './font/pretendard-variable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})

const App = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang='ko' className={`${pretendard.variable}`}>
      <head>
        {/* Geniee Wrapper Head Tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.gnshbrequest = window.gnshbrequest || { cmd: [] };
              window.gnshbrequest.cmd.push(function () {
                window.gnshbrequest.preventFirstRun();
                window.gnshbrequest.forceInternalRequest();
              });
            `,
          }}
        />
        <script
          async
          src='https://securepubads.g.doubleclick.net/tag/js/gpt.js'
        />
        <script
          async
          src='https://cpt.geniee.jp/hb/v1/223680/3011/wrapper.min.js'
        />
        {/* /Geniee Wrapper Head Tag */}
      </head>
      <body className={`${pretendard.className} antialiased`}>
        <GenieeProvider>
          {children}
          <Toaster />
          <GoogleAnalyticsScript />
        </GenieeProvider>
      </body>
    </html>
  )
}

export { App }
