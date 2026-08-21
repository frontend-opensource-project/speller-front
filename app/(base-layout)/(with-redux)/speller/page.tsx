import type { Metadata } from 'next'
import { ROUTES, SITE_NAME, seoMetadata } from '@/shared/config'
import { SpellerAppJsonLd } from '@/shared/ui/json-ld'
import { SpellerPage } from '@/pages/speller'

// 이 페이지의 Metadata 객체
export const metadata: Metadata = {
  // 메인 페이지는 접미사 없이 사이트명만 노출한다.
  title: {
    absolute: SITE_NAME,
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

  ...seoMetadata(ROUTES.speller),
}

const Page = () => (
  <>
    <SpellerAppJsonLd />
    <SpellerPage />
  </>
)

export default Page
