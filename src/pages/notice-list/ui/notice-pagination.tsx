import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/shared/ui/button'
import { cn } from '@/shared/lib/tailwind-merge'
import { ROUTES } from '@/shared/config'

interface NoticePaginationProps {
  currentPage: number
  totalPages: number
}

/** 한 번에 보여 줄 페이지 번호 개수 */
const MAX_VISIBLE = 5

/** 현재 페이지를 가운데 두고 보여 줄 페이지 번호를 고른다. */
const getPageNumbers = (currentPage: number, totalPages: number) => {
  const end = Math.min(
    totalPages,
    Math.max(MAX_VISIBLE, currentPage + Math.floor(MAX_VISIBLE / 2)),
  )
  const start = Math.max(1, end - MAX_VISIBLE + 1)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

/** 1페이지는 쿼리 없는 대표 URL 로 보낸다 (canonical 과 같은 주소). */
const pageHref = (page: number) =>
  page === 1 ? ROUTES.notice.path : `${ROUTES.notice.path}?page=${page}`

/**
 * 공지 목록 페이지네이션.
 *
 * @description
 * 버튼이 아니라 링크로 만들어 크롤러가 2페이지 이후의 공지까지 따라갈 수 있게 한다.
 * 덕분에 클라이언트 컴포넌트가 필요하지 않다.
 */
export function NoticePagination({
  currentPage,
  totalPages,
}: NoticePaginationProps) {
  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers(currentPage, totalPages)
  const isFirst = currentPage === 1
  const isLast = currentPage === totalPages

  return (
    <nav
      aria-label='공지 목록 페이지'
      className='flex items-center justify-center gap-2'
    >
      {isFirst ? (
        <span
          aria-disabled
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'pointer-events-none opacity-50',
          )}
        >
          <ChevronLeft className='h-4 w-4' />
        </span>
      ) : (
        <Link
          href={pageHref(currentPage - 1)}
          aria-label='이전 페이지'
          className={buttonVariants({ variant: 'outline', size: 'icon' })}
        >
          <ChevronLeft className='h-4 w-4' />
        </Link>
      )}

      {pageNumbers.map(page => {
        const isCurrent = page === currentPage
        return (
          <Link
            key={page}
            href={pageHref(page)}
            aria-label={`${page}페이지`}
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              buttonVariants({
                variant: isCurrent ? 'default' : 'outline',
                size: 'icon',
              }),
              'min-w-[2.5rem]',
              isCurrent && 'pointer-events-none',
            )}
          >
            {page}
          </Link>
        )
      })}

      {isLast ? (
        <span
          aria-disabled
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'pointer-events-none opacity-50',
          )}
        >
          <ChevronRight className='h-4 w-4' />
        </span>
      ) : (
        <Link
          href={pageHref(currentPage + 1)}
          aria-label='다음 페이지'
          className={buttonVariants({ variant: 'outline', size: 'icon' })}
        >
          <ChevronRight className='h-4 w-4' />
        </Link>
      )}
    </nav>
  )
}
