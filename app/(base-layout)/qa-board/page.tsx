import type { Metadata } from 'next'
import { ROUTES, seoMetadata } from '@/shared/config'
import { QaBoardPage } from '@/pages/qa-board'

interface PageProps {
  searchParams?: Promise<{
    page?: string
  }>
}

const getPageNumber = (page?: string) => {
  const parsed = Number(page)
  return Number.isInteger(parsed) && parsed > 1 ? parsed : 1
}

/**
 * 2페이지 이후는 제목과 canonical 을 자기 자신으로 구분한다.
 * 전부 1페이지를 가리키면 뒤쪽 페이지의 글이 색인에서 밀린다.
 */
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : undefined
  const page = getPageNumber(resolved?.page)

  if (page === 1) {
    return {
      title: '묻고 답하기',
      ...seoMetadata(ROUTES.qaBoard),
    }
  }

  return {
    title: `묻고 답하기 (${page}페이지)`,
    ...seoMetadata(ROUTES.qaBoard, `?page=${page}`),
  }
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  return <QaBoardPage searchParams={resolvedSearchParams} />
}
