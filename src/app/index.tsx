import 'overlayscrollbars/overlayscrollbars.css'
import './styles/globals.css'

import localFont from 'next/font/local'

import { Toaster } from '@/shared/ui/toaster'
import { GoogleAnalyticsScript } from '@/shared/lib/google-analytics-script'
import { ServiceWorkerRegistration } from '@/shared/lib/service-worker-registration'
import { GenieeProvider } from '@/shared/ui/geniee-provider'
import { InterstitialGeniee } from '@/shared/ui/interstitial-geniee'
import { ThemeProvider } from '@/shared/ui/theme-provider'
import { WebSiteJsonLd } from '@/shared/ui/json-ld'
import { INSTALL_PROMPT_CAPTURE_SCRIPT } from '@/shared/lib/install-prompt-script'

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
        <WebSiteJsonLd />
        {/* 앱 설치 이벤트는 hydration 전에 올 수 있어 가장 먼저 붙잡아 둔다 */}
        <script
          dangerouslySetInnerHTML={{ __html: INSTALL_PROMPT_CAPTURE_SCRIPT }}
        />
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
            <ServiceWorkerRegistration />
          </GenieeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export { App }
