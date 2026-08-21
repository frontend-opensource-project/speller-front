import type { Metadata } from 'next'
import { QaBoardDetailPage } from '@/pages/qa-board'

/**
 * 이용자 지원 창구라 검색 색인 대상이 아니다.
 *
 * @description
 * 글마다 title·description·h1 이 모두 같아서, 색인되면 검색 결과에서 서로는 물론
 * 다른 페이지와도 구분되지 않는다. 사이트맵에도 넣지 않는다.
 * 색인이 필요해지면 먼저 글 제목을 title 에 반영해야 한다.
 */
export const metadata: Metadata = {
  title: '묻고 답하기',
  robots: {
    index: false,
    follow: true,
  },
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  return <QaBoardDetailPage params={resolvedParams} />
}
