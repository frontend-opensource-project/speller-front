import { ResultsPage } from '@/pages/results'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '검사 결과 1페이지 | 바른 한글',
  robots: {
    index: false,
    follow: true,
  },
}

export default function Page() {
  return <ResultsPage pageParam='1' />
}
