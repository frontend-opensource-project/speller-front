import { SpellerPage } from '@/pages/speller'
import type { Metadata } from 'next'

// 이 페이지의 Metadata 객체
export const metadata: Metadata = {
  title: '바른한글(구 한국어 맞춤법/문법 검사기)',
  description:
    '한국어 맞춤법과 문법을 자동으로 검사하고 교정해주는 무료 온라인 도구입니다. 띄어쓰기, 맞춤법, 문장 구조를 분석하여 정확하고 자연스러운 한국어 작성을 도와드립니다.',

  alternates: {
    canonical: 'https://nara-speller.co.kr/speller',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default SpellerPage
