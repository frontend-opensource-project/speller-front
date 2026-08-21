import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
import { InvalidAccessPage } from '@/pages/invalid-access'

export const metadata: Metadata = {
  title: '잘못된 접근',
  ...seoMetadata(ROUTES.invalidAccess),
}

export default InvalidAccessPage
