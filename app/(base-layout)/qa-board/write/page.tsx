import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
import { QaBoardWritePage } from '@/pages/qa-board'

export const metadata: Metadata = {
  title: '묻고 답하기 글쓰기',
  ...seoMetadata(ROUTES.qaBoardWrite),
}

export default function Page() {
  return <QaBoardWritePage />
}
