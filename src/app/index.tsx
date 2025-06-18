import 'overlayscrollbars/overlayscrollbars.css'
import './styles/globals.css'

import localFont from 'next/font/local'

import { Toaster } from '@/shared/ui/toaster'
import { GoogleAdsenseScript } from '@/shared/lib/google-ad-sense-script'
import { GoogleAnalyticsScript } from '@/shared/lib/google-analytics-script'

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
        {children}
        <Toaster />
      </body>
      <GoogleAnalyticsScript />
    </html>
  )
}

export { App }
