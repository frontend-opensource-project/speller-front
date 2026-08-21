import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
import { NoErrorsPage } from '@/pages/no-errors'

export const metadata: Metadata = {
  title: '검사 결과(오류 없음)',
  ...seoMetadata(ROUTES.noErrors),
}

export default NoErrorsPage
