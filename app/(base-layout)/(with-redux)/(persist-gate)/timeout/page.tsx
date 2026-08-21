import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
export { TimeoutPage as default } from '@/pages/timeout'

export const metadata: Metadata = {
  title: '검사 시간 초과',
  ...seoMetadata(ROUTES.timeout),
}
