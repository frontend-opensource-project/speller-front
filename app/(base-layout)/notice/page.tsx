import type { Metadata } from 'next'
import { ROUTES, SITE_SHORT_NAME, seoMetadata } from '@/shared/config'
import { BreadcrumbJsonLd } from '@/shared/ui/json-ld'
import { NoticeListPage, getNoticePageNumber } from '@/pages/notice-list'

interface PageProps {
  searchParams?: Promise<{
    page?: string
  }>
}

/**
 * 2페이지 이후는 제목과 canonical 을 자기 자신으로 구분한다.
 * 전부 1페이지를 가리키면 뒤쪽 페이지의 글이 색인에서 밀린다.
 */
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : undefined
  const page = getNoticePageNumber(resolved?.page)

  if (page === 1) {
    return {
      title: '알리는 글',
      ...seoMetadata(ROUTES.notice),
    }
  }

  return {
    title: `알리는 글 (${page}페이지)`,
    ...seoMetadata(ROUTES.notice, `?page=${page}`),
  }
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: SITE_SHORT_NAME, path: ROUTES.speller.path },
          { name: '알리는 글', path: ROUTES.notice.path },
        ]}
      />
      <NoticeListPage searchParams={resolvedSearchParams} />
    </>
  )
}
