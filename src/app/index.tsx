import 'overlayscrollbars/overlayscrollbars.css'
import './styles/globals.css'

import Script from 'next/script'
import localFont from 'next/font/local'
import { Toaster } from '@/shared/ui/toaster'

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
        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_AD_CLIENT}`}
          crossOrigin='anonymous'
          strategy='afterInteractive'
        />
      </head>
      <body className={`${pretendard.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

export { App }
