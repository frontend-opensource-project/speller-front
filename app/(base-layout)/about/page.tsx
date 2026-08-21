import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
import { AboutPage } from '@/pages/about'

export const metadata: Metadata = {
  title: '소개',
  ...seoMetadata(ROUTES.about),
}

export default AboutPage
