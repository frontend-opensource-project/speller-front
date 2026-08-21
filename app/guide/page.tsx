import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
export { GuidePage as default } from '@/pages/guide'

export const metadata: Metadata = {
  title: '사용법',
  ...seoMetadata(ROUTES.guide),
}
