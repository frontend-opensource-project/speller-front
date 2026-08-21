import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
import { FeedbackPage } from '@/pages/feedback'

export const metadata: Metadata = {
  title: '문의하기',
  ...seoMetadata(ROUTES.feedback),
}

export default FeedbackPage
