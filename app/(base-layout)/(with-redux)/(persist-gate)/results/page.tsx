import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
import { ResultsPage } from '@/pages/results'

export const metadata: Metadata = {
  title: '검사 결과',
  ...seoMetadata(ROUTES.results),
}

export default ResultsPage
