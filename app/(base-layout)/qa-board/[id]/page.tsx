import type { Metadata } from 'next'
import {
  DYNAMIC_ROUTE_PREFIX,
  ROUTES,
  SITE_SHORT_NAME,
  dynamicSeoMetadata,
} from '@/shared/config'
import { BreadcrumbJsonLd } from '@/shared/ui/json-ld'
import { QaBoardDetailPage } from '@/pages/qa-board'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: '묻고 답하기',
    ...dynamicSeoMetadata({
      path: `${DYNAMIC_ROUTE_PREFIX.qaBoardDetail}/${id}`,
    }),
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: SITE_SHORT_NAME, path: ROUTES.speller.path },
          { name: '묻고 답하기', path: ROUTES.qaBoard.path },
          {
            name: `${resolvedParams.id}번 글`,
            path: `${DYNAMIC_ROUTE_PREFIX.qaBoardDetail}/${resolvedParams.id}`,
          },
        ]}
      />
      <QaBoardDetailPage params={resolvedParams} />
    </>
  )
}
