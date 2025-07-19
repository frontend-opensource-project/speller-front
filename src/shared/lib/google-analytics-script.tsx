import Script from 'next/script'

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID

declare global {
  interface Window {
    gtag: (
      type: 'event',
      eventName: string,
      eventParams: Record<string, unknown>,
    ) => void
  }
}

const GoogleAnalyticsScript = () => {
  if (!GA4_ID) {
    // 환경 변수가 없을 때 앱 전체가 중단되는 것을 방지하기 위해 null을 반환합니다.
    console.warn(
      'NEXT_PUBLIC_GA4_ID가 설정되지 않아 Google Analytics가 비활성화되었습니다.',
    )
    return null
  }

  return (
    <>
      {/* Google Analytics 스크립트를 비동기적으로 로드합니다. */}
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
      />
      {/* GA를 초기화하고, 자동 페이지뷰 수집 기능을 비활성화합니다. */}
      <Script
        id='gtag-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA4_ID}', {
              send_page_view: false,
            });
          `,
        }}
      />
    </>
  )
}

export { GoogleAnalyticsScript }
