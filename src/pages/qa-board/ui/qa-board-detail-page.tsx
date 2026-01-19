import Link from 'next/link'
import { ArrowLeft, Eye, MessageCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { QaBoardApi } from '../api/qa-board-service'
import { Button } from '@/shared/ui/button'
import { ContentLayout } from '@/shared/ui/content-layout'
import { cn } from '@/shared/lib/tailwind-merge'

interface QaBoardDetailPageProps {
  params: {
    id: string
  }
}

export async function QaBoardDetailPage({ params }: QaBoardDetailPageProps) {
  const id = Number(params.id)

  if (isNaN(id)) {
    notFound()
  }

  let data
  try {
    data = await QaBoardApi.getDetail(id)
    // 조회수 증가 (비동기로 처리)
    QaBoardApi.incrementViews(id).catch(() => {
      // 에러 무시
    })
  } catch {
    notFound()
  }

  const isAnswered = data.status === 'answered'
  const date = new Date(data.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <ContentLayout>
      <div className='grid h-full flex-1 shrink-0 grid-rows-[auto_1fr] gap-6 px-4 py-6 tab:px-[3.75rem] tab:py-8 pc:px-0'>
        {/* 헤더 */}
        <div className='flex items-center gap-4'>
          <Link href='/qa-board'>
            <Button variant='outline' size='icon'>
              <ArrowLeft className='h-5 w-5' />
            </Button>
          </Link>
          <h1 className='text-slate-900 text-xl font-bold tab:text-2xl'>
            묻고 답하기
          </h1>
        </div>

        {/* 컨텐츠 */}
        <div className='flex flex-col gap-6'>
          {/* 질문 카드 */}
          <div className='rounded-lg border border-slate-200 bg-white p-5 tab:p-6'>
            {/* 제목 영역 */}
            <div className='flex flex-col gap-3 border-b border-slate-200 pb-4'>
              <div className='flex items-start justify-between gap-3'>
                <h2 className='text-slate-900 flex-1 text-xl font-bold tab:text-2xl'>
                  {data.title}
                </h2>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1 text-xs font-medium',
                    isAnswered
                      ? 'bg-primary/10 text-primary'
                      : 'bg-slate-100 text-slate-600',
                  )}
                >
                  {isAnswered ? '답변완료' : '답변대기'}
                </span>
              </div>

              {/* 메타 정보 */}
              <div className='flex flex-wrap items-center gap-2 text-sm text-slate-500 tab:gap-3'>
                <span className='font-medium'>{data.author}</span>
                <span className='text-slate-300'>|</span>
                <span>{date}</span>
                <span className='text-slate-300'>|</span>
                <div className='flex items-center gap-1'>
                  <Eye className='h-4 w-4' />
                  <span>{data.views.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 질문 내용 */}
            <div className='text-slate-700 mt-6 whitespace-pre-wrap text-base leading-relaxed tab:text-lg'>
              {data.content}
            </div>
          </div>

          {/* 답변 카드 */}
          {data.answer ? (
            <div className='rounded-lg border-2 border-primary/20 bg-primary/5 p-5 tab:p-6'>
              <div className='mb-4 flex items-center gap-2'>
                <MessageCircle className='h-5 w-5 text-primary' />
                <h3 className='text-lg font-bold text-primary'>답변</h3>
              </div>

              {/* 답변 내용 */}
              <div className='text-slate-700 mb-4 whitespace-pre-wrap rounded-lg bg-white p-4 text-base leading-relaxed tab:text-lg'>
                {data.answer.content}
              </div>

              {/* 답변 메타 정보 */}
              <div className='flex items-center gap-2 text-sm text-slate-500'>
                <span className='font-medium text-primary'>
                  {data.answer.author}
                </span>
                <span className='text-slate-300'>|</span>
                <span>
                  {new Date(data.answer.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className='bg-slate-50 rounded-lg border border-slate-200 p-8 text-center'>
              <MessageCircle className='mx-auto h-12 w-12 text-slate-300' />
              <p className='mt-3 text-slate-500'>
                아직 답변이 등록되지 않았습니다.
              </p>
              <p className='mt-1 text-sm text-slate-400'>
                빠른 시일 내에 답변 드리겠습니다.
              </p>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className='flex justify-center gap-3'>
            <Link href='/qa-board'>
              <Button variant='outline' className='min-w-[120px]'>
                목록으로
              </Button>
            </Link>
            <Link href='/qa-board/write'>
              <Button className='min-w-[120px]'>새 질문 작성</Button>
            </Link>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}
