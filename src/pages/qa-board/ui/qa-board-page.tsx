import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { QaBoardApi } from '../api/qa-board-service'
import { QaBoardItem } from './qa-board-item'
import { QaBoardPagination } from './qa-board-pagination'
import { Button } from '@/shared/ui/button'
import { ContentLayout } from '@/shared/ui/content-layout'

interface QaBoardPageProps {
  searchParams?: {
    page?: string
  }
}

export async function QaBoardPage({ searchParams }: QaBoardPageProps) {
  const currentPage = Number(searchParams?.page) || 1
  const pageSize = 10

  const data = await QaBoardApi.getList(currentPage, pageSize)

  return (
    <ContentLayout>
      <div className='grid h-full flex-1 shrink-0 grid-rows-[auto_1fr] gap-6 px-4 py-6 tab:px-[3.75rem] tab:py-8 pc:px-0'>
        {/* 헤더 섹션 */}
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 tab:flex-row tab:items-center tab:justify-between'>
            <div>
              <h1 className='text-slate-900 text-2xl font-bold tab:text-3xl'>
                묻고 답하기
              </h1>
              <p className='mt-2 text-sm text-slate-600 tab:text-base'>
                우리말 공부 중 모르는 부분을 질문해주세요
              </p>
            </div>
            <Link href='/qa-board/write'>
              <Button className='w-full gap-2 tab:w-auto'>
                <PlusCircle className='h-5 w-5' />
                질문하기
              </Button>
            </Link>
          </div>

          {/* 안내문 */}
          <div className='bg-blue-50 rounded-lg border border-blue-200 p-4 tab:p-5'>
            <div className='text-blue-900 flex flex-col gap-2 text-sm leading-relaxed tab:text-base'>
              <p>
                <strong className='font-semibold'>
                  &apos;묻고 답하기&apos;에 글을 올리실 때는 실명을 써 주시기
                  바랍니다.
                </strong>{' '}
                (우리말배움터 정책)
              </p>
              <p>
                우리말을 공부하시다가 모르는 부분이 있으면 &apos;묻고
                답하기&apos;에 글을 올리시면 됩니다.
              </p>
              <p>
                그 외에 검사기 기능 자체에 대한 문의는{' '}
                <Link
                  href='/feedback'
                  className='font-semibold text-primary underline hover:text-primary/80'
                >
                  &apos;문의하기&apos;
                </Link>
                를 통해 문의해주시면 됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 컨텐츠 섹션 */}
        <div className='flex flex-col gap-4'>
          {/* 질문 목록 */}
          {data.items.length === 0 ? (
            <div className='bg-slate-50 flex min-h-[400px] items-center justify-center rounded-lg border border-slate-200'>
              <div className='text-center'>
                <p className='text-lg text-slate-500'>
                  아직 등록된 질문이 없습니다.
                </p>
                <p className='mt-2 text-sm text-slate-400'>
                  첫 번째 질문을 등록해보세요!
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className='flex flex-col gap-3'>
                {data.items.map(item => (
                  <QaBoardItem key={item.id} item={item} />
                ))}
              </div>

              {/* 페이지네이션 */}
              <div className='mt-6'>
                <QaBoardPagination
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </ContentLayout>
  )
}
