import Script from 'next/script'

const GoogleAdsenseScript = () => {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_AD_CLIENT}`}
      strategy='lazyOnload'
      crossOrigin='anonymous'
    />
  )
}

export { GoogleAdsenseScript }
