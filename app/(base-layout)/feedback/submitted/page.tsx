import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
import { SubmittedPage } from '@/pages/feedback'

export const metadata: Metadata = {
  title: '문의 접수 완료',
  ...seoMetadata(ROUTES.feedbackSubmitted),
}

export default SubmittedPage
