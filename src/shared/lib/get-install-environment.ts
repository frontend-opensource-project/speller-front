/**
 * 앱 설치 방법을 정하기 위한 실행 환경.
 * - standalone: 이미 설치된 앱으로 실행 중
 * - in-app: 카카오톡 등 앱 안의 브라우저. 홈 화면 추가가 안 되므로 외부 브라우저로 안내한다.
 * - ios: iOS/iPadOS. 설치 API 가 없어 공유 메뉴의 '홈 화면에 추가'로 안내한다.
 * - macos-safari: macOS Safari 17 이상. 설치 API 가 없어 '파일 > Dock에 추가'로 안내한다.
 * - browser: 그 밖의 브라우저. beforeinstallprompt 가 올 때만 설치할 수 있다.
 */
export type InstallEnvironment =
  | { type: 'standalone' }
  | { type: 'in-app'; app: 'kakaotalk' | 'other' }
  | { type: 'ios'; browser: IosBrowser }
  | { type: 'macos-safari' }
  | { type: 'browser' }

/** iOS 26 부터 Safari 의 공유 버튼이 ⋯ 메뉴 안으로 들어가 안내를 나눈다. */
export type IosBrowser = 'safari' | 'safari-26' | 'chrome' | 'other'

// 웹뷰 표시('; wv)')는 Android 웹뷰 전반을 잡는다. iOS 웹뷰는 표시가 없어 앱별 토큰으로만 잡는다.
const IN_APP_PATTERN =
  /NAVER\(inapp|DaumApps|Instagram|FBAN|FBAV|FB_IAB|Line\/|everytimeApp|BAND\/|; wv\)/i

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.matchMedia('(display-mode: fullscreen)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true

// iPadOS 는 기본으로 Mac 의 UA 를 쓰므로 터치 지원 여부로 구분한다.
const isIos = (ua: string) =>
  /iPhone|iPad|iPod/.test(ua) ||
  (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)

/** 브라우저가 아닌 앱 안의 웹뷰(UA 에 Safari 표시가 없음)면 null. */
const getIosBrowser = (ua: string): IosBrowser | null => {
  if (/CriOS/.test(ua)) return 'chrome'
  if (/FxiOS|EdgiOS|OPiOS|Whale/.test(ua)) return 'other'
  if (!/Safari/.test(ua)) return null

  const safariVersion = ua.match(/Version\/(\d+)/)
  if (!safariVersion) return 'other'

  return Number(safariVersion[1]) >= 26 ? 'safari-26' : 'safari'
}

// Mac 의 Chrome·Edge 등도 UA 에 Safari 가 들어 있지만 Version/ 표시는 Safari 에만 있다.
// 'Dock에 추가'는 Safari 17(macOS Sonoma)부터 지원한다.
const isMacSafariWithDock = (ua: string) => {
  if (!/Macintosh/.test(ua) || !/Safari/.test(ua)) return false
  if (/Chrome|Chromium|Edg|Firefox|OPR|Whale/.test(ua)) return false

  const safariVersion = ua.match(/Version\/(\d+)/)
  return !!safariVersion && Number(safariVersion[1]) >= 17
}

const getInstallEnvironment = (): InstallEnvironment => {
  const ua = navigator.userAgent

  if (isStandalone()) return { type: 'standalone' }
  if (/KAKAOTALK/i.test(ua)) return { type: 'in-app', app: 'kakaotalk' }
  if (IN_APP_PATTERN.test(ua)) return { type: 'in-app', app: 'other' }
  if (isIos(ua)) {
    const browser = getIosBrowser(ua)
    return browser ? { type: 'ios', browser } : { type: 'in-app', app: 'other' }
  }
  if (isMacSafariWithDock(ua)) return { type: 'macos-safari' }

  return { type: 'browser' }
}

export { getInstallEnvironment }
