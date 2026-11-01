import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LONG_MODE_ENABLED, ROUTES, seoMetadata } from '@/shared/config'
import { LongResultsPage } from '@/pages/long-results'

export const metadata: Metadata = {
  title: '긴글 검사 결과',
  ...seoMetadata(ROUTES.longResults),
}

const Page = () => {
  if (!LONG_MODE_ENABLED) notFound()
  return <LongResultsPage />
}

export default Page
