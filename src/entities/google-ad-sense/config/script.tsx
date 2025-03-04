import Script from 'next/script'

export const GoogleAdSenseScript = () => {
  return (
    <Script
      defer
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_AD_CLIENT}`}
      crossOrigin='anonymous'
      strategy='afterInteractive'
    />
  )
}
