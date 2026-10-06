import type { MetadataRoute } from 'next'
import {
  ROUTES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
} from '@/shared/config'

/**
 * 홈 화면/데스크톱에 앱으로 설치할 때 쓰는 Web App Manifest.
 *
 * @description
 * manifest 안의 URL 에는 basePath 가 자동으로 붙지 않으므로 직접 붙인다.
 * - start_url: `/` 는 middleware 가 `/speller` 로 리다이렉트하므로 검사기 화면을 바로 연다.
 * - id: 스테이징(basePath)과 운영이 같은 도메인을 쓰므로, 서로 다른 앱으로 설치되도록 basePath 를 포함한다.
 */
const basePath = process.env.NEXT_BASE_PATH || ''

export default function manifest(): MetadataRoute.Manifest {
  const startUrl = `${basePath}${ROUTES.speller.path}/`

  return {
    id: startUrl,
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    lang: 'ko',
    dir: 'ltr',
    start_url: startUrl,
    scope: `${basePath}/`,
    display: 'standalone',
    background_color: '#F3F4F9',
    theme_color: '#ffffff',
    categories: ['education', 'productivity', 'utilities'],
    icons: [
      {
        src: `${basePath}/icons/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${basePath}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${basePath}/icons/icon-maskable-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
