import { App } from '@/app'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
  TITLE_TEMPLATE,
} from '@/shared/config'
import { Metadata } from 'next'

export const metadata: Metadata = {
  // 상대 경로로 적은 og:image 등을 절대 URL 로 바꿔 주는 기준 주소
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: SITE_SHORT_NAME,
    url: SITE_URL,
    title: {
      default: SITE_NAME,
      template: TITLE_TEMPLATE,
    },
    description: SITE_DESCRIPTION,
  },

  twitter: {
    card: 'summary_large_image',
    title: {
      default: SITE_NAME,
      template: TITLE_TEMPLATE,
    },
    description: SITE_DESCRIPTION,
  },

  keywords: [
    '맞춤법',
    '문법',
    '문서교정',
    '교열',
    '한국어',
    '부산대학교',
    '나라인포테크',
    '무료',
    '글쓰기',
    '띄어쓰기',
    '오타교정',
    '순화용어',
    '한국어 문법',
    '한국어 글쓰기',
    '자기소개서',
    '한국어 교육',
    '한글',
    '한국어 학습',
    'Korean as Second Language',
    'Korean speller',
    'spell checker',
    'spell error correction',
    'grammar checker',
    'grammar error correction',
  ],
}

export default App
