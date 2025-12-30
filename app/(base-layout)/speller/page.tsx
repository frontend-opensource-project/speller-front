import { SpellerPage } from '@/pages/speller'
import type { Metadata } from 'next'

// 이 페이지의 Metadata 객체
export const metadata: Metadata = {
  title: '바른한글(유료 사용자용)',

  alternates: {
    canonical: 'https://nara-speller.co.kr/no-ads/speller',
  },

  robots: {
    index: false,
    follow: false,
  },
}

export default SpellerPage
