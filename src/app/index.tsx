import 'overlayscrollbars/overlayscrollbars.css'
import './styles/globals.css'

import localFont from 'next/font/local'

import { Toaster } from '@/shared/ui/toaster'
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
      <head></head>
      <body className={`${pretendard.className} antialiased`}>
        {children}
        <Toaster />
        <GoogleAnalyticsScript />
      </body>
    </html>
  )
}

export { App }
