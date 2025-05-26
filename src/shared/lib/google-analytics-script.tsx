import { GoogleAnalytics } from '@next/third-parties/google'

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID

const GoogleAnalyticsScript = () => {
  if (!GA4_ID) {
    throw new Error('Missing NEXT_PUBLIC_GA4_ID')
  }

  return <GoogleAnalytics gaId={GA4_ID} />
}

export { GoogleAnalyticsScript }
