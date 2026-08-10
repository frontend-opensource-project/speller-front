import 'overlayscrollbars/overlayscrollbars.css'
import './styles/globals.css'

import localFont from 'next/font/local'

import { Toaster } from '@/shared/ui/toaster'
import { GoogleAnalyticsScript } from '@/shared/lib/google-analytics-script'
import { GenieeProvider } from '@/shared/ui/geniee-provider'
import { InterstitialGeniee } from '@/shared/ui/interstitial-geniee'
import { ThemeProvider } from '@/shared/ui/theme-provider'

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
    <html
      lang='ko'
      className={`${pretendard.variable}`}
      suppressHydrationWarning
    >
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
        <ThemeProvider>
          <GenieeProvider>
            {children}
            <InterstitialGeniee />
            <Toaster />
            <GoogleAnalyticsScript />
          </GenieeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export { App }
