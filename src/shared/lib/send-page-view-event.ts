// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string, title?: string) => {
  if (typeof window.gtag !== 'function' || !process.env.NEXT_PUBLIC_GA4_ID) {
    console.warn('GA 태그 ID가 없거나 gtag 함수를 찾을 수 없습니다.')
    return
  }

  // 'event' 명령어를 사용하여 페이지뷰 전송
  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.origin + url, // 전체 URL을 제공하는 것이 좋습니다.
  })
}
