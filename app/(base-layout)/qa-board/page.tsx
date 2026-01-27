import { QaBoardPage } from '@/pages/qa-board'

interface PageProps {
  searchParams?: Promise<{
    page?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  return <QaBoardPage searchParams={resolvedSearchParams} />
}
