import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
export { OrderPage as default } from '@/pages/order'

export const metadata: Metadata = {
  title: '구매 안내',
  ...seoMetadata(ROUTES.order),
}
