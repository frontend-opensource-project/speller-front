import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ContentLayout } from '@/shared/ui/content-layout'
import { Button } from '@/shared/ui/button'
import { Markdown } from '@/shared/ui/markdown'
import { getNoticeDetail } from '../api/get-notice-detail'

interface NoticeDetailPageProps {
  id: string
}

export async function NoticeDetailPage({ id }: NoticeDetailPageProps) {
  const notice = await getNoticeDetail(id)

  if (!notice) {
    notFound()
  }

  return (
    <ContentLayout>
      <div className='grid h-full flex-1 shrink-0 grid-rows-[auto_1fr] gap-6 px-4 py-6 tab:px-[3.75rem] tab:py-8 pc:px-0'>
        {/* 헤더: 뒤로가기 + 제목/날짜 */}
        <div className='flex items-center gap-4'>
          <Link href='/speller'>
            <Button variant='outline' size='icon'>
              <ArrowLeft className='h-5 w-5' />
            </Button>
          </Link>
          <div>
            <h1 className='text-slate-900 text-xl font-bold dark:text-white tab:text-2xl'>
              {notice.title}
            </h1>
            <p className='mt-1 text-sm text-slate-500 dark:text-dark-text'>
              {notice.date}
            </p>
          </div>
        </div>

        {/* 본문 카드 */}
        <div className='rounded-lg border border-slate-200 bg-white p-5 dark:border-dark-border dark:bg-dark-surface tab:p-6'>
          <Markdown>{notice.body}</Markdown>
        </div>
      </div>
    </ContentLayout>
  )
}
