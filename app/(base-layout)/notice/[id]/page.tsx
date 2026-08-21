import type { Metadata } from 'next'
import {
  DYNAMIC_ROUTE_PREFIX,
  ROUTES,
  SITE_SHORT_NAME,
  dynamicSeoMetadata,
} from '@/shared/config'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/shared/ui/json-ld'
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
    return { title: '공지사항' }
  }

  return {
    title: notice.title,
    ...dynamicSeoMetadata({
      path: `${DYNAMIC_ROUTE_PREFIX.notice}/${id}`,
    }),
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const notice = await getNoticeDetail(id)
  const path = `${DYNAMIC_ROUTE_PREFIX.notice}/${id}`

  return (
    <>
      {notice && (
        <>
          <ArticleJsonLd
            path={path}
            headline={notice.title}
            datePublished={notice.date}
          />
          <BreadcrumbJsonLd
            items={[
              { name: SITE_SHORT_NAME, path: ROUTES.speller.path },
              { name: notice.title, path },
            ]}
          />
        </>
      )}
      <NoticeDetailPage id={id} />
    </>
  )
}
