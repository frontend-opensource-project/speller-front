import type { Metadata } from 'next'
import { NoticeDetailPage, getNoticeDetail } from '@/pages/notice-detail'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const notice = await getNoticeDetail(id)

  if (!notice) {
    return { title: '공지사항 | 바른한글' }
  }

  return {
    title: `${notice.title} | 바른한글`,
    alternates: {
      canonical: `https://nara-speller.co.kr/notice/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <NoticeDetailPage id={id} />
}
