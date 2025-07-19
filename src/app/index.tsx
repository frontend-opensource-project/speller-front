import 'overlayscrollbars/overlayscrollbars.css'
import './styles/globals.css'

import localFont from 'next/font/local'
import { Suspense } from 'react'

import { Toaster } from '@/shared/ui/toaster'
import { GoogleAdsenseScript } from '@/shared/lib/google-ad-sense-script'
import { GoogleAnalyticsScript } from '@/shared/lib/google-analytics-script'
import AnalyticsTracker from '@/shared/lib/analytics-tracker'
import EngagementHeartbeat from '@/shared/lib/engagement-heartbeat'
import { AdRefreshProvider } from '@/shared/lib/ad-refresh-context'

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
        <GoogleAdsenseScript />
      </head>
      <body className={`${pretendard.className} antialiased`}>
        <AdRefreshProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
            <EngagementHeartbeat />
          </Suspense>
          {children}
        </AdRefreshProvider>
        <Toaster />
        <GoogleAnalyticsScript />
      </body>
    </html>
  )
}

export { App }
