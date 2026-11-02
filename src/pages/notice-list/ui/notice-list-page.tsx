import { notFound } from 'next/navigation'
import { getNoticeDetails } from '@/entities/notice'
import { ContentLayout } from '@/shared/ui/content-layout'
import { NoticeListItem } from './notice-list-item'
import { NoticePagination } from './notice-pagination'
import { NOTICE_PAGE_SIZE, getNoticePageNumber } from '../model/notice-page'

interface NoticeListPageProps {
  searchParams?: {
    page?: string
  }
}

export async function NoticeListPage({ searchParams }: NoticeListPageProps) {
  const notices = await getNoticeDetails()
  const currentPage = getNoticePageNumber(searchParams?.page)
  const totalPages = Math.max(1, Math.ceil(notices.length / NOTICE_PAGE_SIZE))

  // 범위를 벗어난 페이지는 같은 목록을 중복으로 보여 주지 않도록 404 로 처리한다.
  if (currentPage > totalPages) notFound()

  const start = (currentPage - 1) * NOTICE_PAGE_SIZE
  const pageItems = notices.slice(start, start + NOTICE_PAGE_SIZE)

  return (
    <ContentLayout>
      <div className='grid h-full flex-1 shrink-0 grid-rows-[auto_1fr] gap-6 px-4 py-6 tab:px-[3.75rem] tab:py-8 pc:px-0'>
        {/* 헤더 섹션 */}
        <div className='flex flex-col gap-2'>
          <h1 className='text-slate-900 text-2xl font-bold dark:text-white tab:text-3xl'>
            알리는 글
          </h1>
          <p className='text-sm text-slate-600 dark:text-dark-text tab:text-base'>
            바른한글 맞춤법 검사기의 서비스 점검, 장애, 기능 변경처럼 꼭
            알려드려야 할 소식을 모았습니다.
          </p>
        </div>

        {/* 목록 섹션 */}
        <div className='flex flex-col gap-4'>
          {pageItems.length === 0 ? (
            <div className='bg-slate-50 flex min-h-[400px] items-center justify-center rounded-lg border border-slate-200 dark:border-dark-border dark:bg-dark-elevated'>
              <p className='text-lg text-slate-500 dark:text-dark-text'>
                아직 등록된 글이 없습니다.
              </p>
            </div>
          ) : (
            <>
              <ul className='flex flex-col gap-3'>
                {pageItems.map(notice => (
                  <li key={notice.id}>
                    <NoticeListItem notice={notice} />
                  </li>
                ))}
              </ul>

              <div className='mt-6'>
                <NoticePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </ContentLayout>
  )
}
