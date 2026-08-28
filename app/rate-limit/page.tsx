import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
export { RateLimitPage as default } from '@/pages/rate-limit'

export const metadata: Metadata = {
  title: '일시적으로 접속이 제한되었습니다',
  ...seoMetadata(ROUTES.rateLimit),
}
