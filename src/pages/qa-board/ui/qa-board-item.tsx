import Link from 'next/link'
import { MessageCircle, Eye } from 'lucide-react'
import type { QaBoardItem } from '../model/qa-board-schema'
import { cn } from '@/shared/lib/tailwind-merge'

interface QaBoardItemProps {
  item: QaBoardItem
}

export function QaBoardItem({ item }: QaBoardItemProps) {
  const isAnswered = item.status === 'answered'
  const date = new Date(item.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <Link
      href={`/qa-board/${item.id}`}
      className='block rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md tab:p-5'
    >
      <div className='flex flex-col gap-3'>
        {/* 제목과 상태 */}
        <div className='flex items-start justify-between gap-3'>
          <h3 className='text-slate-900 flex-1 text-base font-semibold tab:text-lg'>
            <span className='text-primary'>[Q]</span> {item.title}
          </h3>
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
          <span>{item.author}</span>
          <span className='text-slate-300'>|</span>
          <span>{date}</span>
          <span className='text-slate-300'>|</span>
          <div className='flex items-center gap-1'>
            <Eye className='h-4 w-4' />
            <span>{item.views.toLocaleString()}</span>
          </div>
          {item.answerCount > 0 && (
            <>
              <span className='text-slate-300'>|</span>
              <div className='flex items-center gap-1 text-primary'>
                <MessageCircle className='h-4 w-4' />
                <span>{item.answerCount}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
