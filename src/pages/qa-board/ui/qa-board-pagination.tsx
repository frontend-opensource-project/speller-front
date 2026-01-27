'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/tailwind-merge'

interface QaBoardPaginationProps {
  currentPage: number
  totalPages: number
}

export function QaBoardPagination({
  currentPage,
  totalPages,
}: QaBoardPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('page', page.toString())
    router.push(`/qa-board?${params.toString()}`)
  }

  // 페이지 번호 배열 생성 (최대 5개 표시)
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 현재 페이지를 중심으로 5개 표시
      let start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisible - 1)

      // end가 totalPages에 가까우면 start 조정
      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className='flex items-center justify-center gap-2'>
      {/* 이전 페이지 */}
      <Button
        variant='outline'
        size='icon'
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label='이전 페이지'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      {/* 페이지 번호들 */}
      {pageNumbers.map(pageNum => (
        <Button
          key={pageNum}
          variant={currentPage === pageNum ? 'default' : 'outline'}
          size='icon'
          onClick={() => goToPage(pageNum)}
          className={cn(
            'min-w-[2.5rem]',
            currentPage === pageNum && 'pointer-events-none',
          )}
        >
          {pageNum}
        </Button>
      ))}

      {/* 다음 페이지 */}
      <Button
        variant='outline'
        size='icon'
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label='다음 페이지'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  )
}
