import { ResultsPage } from '@/pages/results'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    page: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page } = await params

  // 1페이지는 기본 라우트로 리다이렉트
  if (page === '1') {
    redirect('/results')
  }

  const pageTitle = `검사 결과 ${page}페이지 | 바른 한글`

  return {
    title: pageTitle,
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { page: pageNum } = await params

  // 잘못된 페이지 번호 처리
  if (!/^\d+$/.test(pageNum)) {
    redirect('/results')
  }

  const currentPage = Number(pageNum)

  // 0이나 음수, 또는 1페이지 처리
  if (currentPage <= 1) {
    redirect('/results')
  }

  return <ResultsPage pageParam={pageNum} />
}
