declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

let isScriptLoaded = false
let loadPromise: Promise<void> | null = null

export function loadRecaptchaScript(): Promise<void> {
  if (isScriptLoaded) {
    return Promise.resolve()
  }

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('reCAPTCHA는 브라우저 환경에서만 사용 가능합니다.'))
      return
    }

    if (!RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA site key가 설정되지 않았습니다.')
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true

    script.onload = () => {
      isScriptLoaded = true
      resolve()
    }

    script.onerror = () => {
      reject(new Error('reCAPTCHA 스크립트 로드에 실패했습니다.'))
    }

    document.head.appendChild(script)
  })

  return loadPromise
}

export async function executeRecaptcha(action: string): Promise<string> {
  if (!RECAPTCHA_SITE_KEY) {
    console.warn('reCAPTCHA site key가 설정되지 않았습니다.')
    return ''
  }

  await loadRecaptchaScript()

  return new Promise((resolve, reject) => {
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
          action,
        })
        resolve(token)
      } catch (error) {
        reject(error)
      }
    })
  })
}

export async function verifyRecaptchaToken(
  token: string,
  action: string,
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.warn('reCAPTCHA secret key가 설정되지 않았습니다.')
    return { success: true }
  }

  if (!token) {
    return { success: false, error: 'reCAPTCHA 토큰이 없습니다.' }
  }

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      },
    )

    const data = await response.json()

    if (!data.success) {
      return { success: false, error: 'reCAPTCHA 검증에 실패했습니다.' }
    }

    if (data.action !== action) {
      return { success: false, error: 'reCAPTCHA 액션이 일치하지 않습니다.' }
    }

    // score가 0.5 미만이면 봇으로 판단
    if (data.score < 0.5) {
      return {
        success: false,
        score: data.score,
        error: '봇으로 의심되는 요청입니다.',
      }
    }

    return { success: true, score: data.score }
  } catch (error) {
    console.error('reCAPTCHA 검증 오류:', error)
    return { success: false, error: 'reCAPTCHA 검증 중 오류가 발생했습니다.' }
  }
}
