import { notFound } from 'next/navigation'
import { QaBoardApi } from '../api/qa-board-service'
import { QaBoardDetailClient } from './qa-board-detail-client'

interface QaBoardDetailPageProps {
  params: {
    id: string
  }
}

export async function QaBoardDetailPage({ params }: QaBoardDetailPageProps) {
  const id = Number(params.id)

  if (isNaN(id)) {
    notFound()
  }

  let data
  try {
    data = await QaBoardApi.getDetail(id)
    // 조회수 증가 (비동기로 처리)
    QaBoardApi.incrementViews(id).catch(() => {
      // 에러 무시
    })
  } catch {
    notFound()
  }

  return <QaBoardDetailClient data={data} />
}
