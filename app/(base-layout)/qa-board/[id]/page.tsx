import { QaBoardDetailPage } from '@/pages/qa-board'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  return <QaBoardDetailPage params={resolvedParams} />
}
