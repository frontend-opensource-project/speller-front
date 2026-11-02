import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { summarizeNotice, type NoticeDetail } from '@/entities/notice'
import { DYNAMIC_ROUTE_PREFIX } from '@/shared/config'

interface NoticeListItemProps {
  notice: NoticeDetail
}

export function NoticeListItem({ notice }: NoticeListItemProps) {
  const summary = summarizeNotice(notice)

  return (
    <Link
      href={`${DYNAMIC_ROUTE_PREFIX.notice}/${notice.id}`}
      className='block rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-dark-border dark:bg-dark-surface tab:p-5'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex flex-col gap-1.5'>
          <h2 className='text-slate-900 text-base font-bold dark:text-white tab:text-lg'>
            {notice.title}
          </h2>
          {summary && (
            <p className='line-clamp-1 text-sm text-slate-500 dark:text-dark-subtle'>
              {summary}
            </p>
          )}
          <time
            dateTime={notice.date}
            className='text-xs text-slate-400 dark:text-dark-subtle'
          >
            {notice.date}
          </time>
        </div>
        <ChevronRight className='mt-1 h-5 w-5 shrink-0 text-slate-400 dark:text-dark-subtle' />
      </div>
    </Link>
  )
}
