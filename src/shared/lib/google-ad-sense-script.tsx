const GoogleAdsenseScript = () => {
  if (!process.env.NEXT_PUBLIC_AD_CLIENT) {
    throw new Error('Missing NEXT_PUBLIC_AD_CLIENT')
  }

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_AD_CLIENT}`}
      crossOrigin='anonymous'
    />
  )
}

export { GoogleAdsenseScript }
