'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { RecentNotice } from '@/entities/notice'
import { DYNAMIC_ROUTE_PREFIX } from '@/shared/config'
import { cn } from '@/shared/lib/tailwind-merge'

// 한 제목이 머무는 시간
const ROTATE_INTERVAL_MS = 4500

interface RecentNoticeTickerProps {
  notices: RecentNotice[]
}

/** YYYY-MM-DD → MM.DD */
const formatDate = (date: string) => date.slice(5).replace('-', '.')

const NoticeLine = ({ notice }: { notice: RecentNotice }) => (
  <>
    <span className='truncate'>{notice.title}</span>
    <span className='shrink-0 text-xs text-slate-400 dark:text-dark-subtle'>
      {formatDate(notice.date)}
    </span>
  </>
)

/**
 * 최근 알리는 글 제목을 하나씩 보여 주는 전광판.
 * 공지가 둘 이상이면 일정 시간마다 위로 올라가며 다음 제목으로 바뀌고,
 * 마우스를 올리거나 포커스가 가면 멈춘다.
 */
export const RecentNoticeTicker = ({ notices }: RecentNoticeTickerProps) => {
  // 바뀌는 순간에는 이전 제목을 잠시 남겨 위로 올라가며 사라지게 한다
  const [{ current, prev }, setSlide] = useState<{
    current: number
    prev: number | null
  }>({ current: 0, prev: null })
  const [isPaused, setIsPaused] = useState(false)
  const count = notices.length

  useEffect(() => {
    if (count < 2 || isPaused) return
    const timer = setInterval(() => {
      setSlide(({ current }) => ({
        current: (current + 1) % count,
        prev: current,
      }))
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [count, isPaused])

  if (count === 0) return null

  const notice = notices[current]
  const prevNotice = prev === null ? null : notices[prev]

  return (
    <section
      aria-label='최근 알리는 글'
      className='mt-[0.94rem] flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-sm dark:bg-dark-surface tab:mt-[1.75rem] tab:gap-3 tab:px-4 pc:mt-[1.97rem] pc:h-10 pc:text-base'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <span className='shrink-0 rounded-full bg-blue-400 px-2 py-0.5 text-xs font-medium text-white'>
        새 소식
      </span>
      <div className='relative h-full min-w-0 flex-1 overflow-hidden'>
        {prevNotice && (
          <span
            key={`prev-${prev}`}
            aria-hidden
            className='absolute inset-0 flex items-center gap-2 duration-500 animate-out fade-out slide-out-to-top-full fill-mode-forwards motion-reduce:hidden'
            onAnimationEnd={() => setSlide(slide => ({ ...slide, prev: null }))}
          >
            <NoticeLine notice={prevNotice} />
          </span>
        )}
        <Link
          key={notice.id}
          href={`${DYNAMIC_ROUTE_PREFIX.notice}/${notice.id}`}
          className={cn(
            'absolute inset-0 flex items-center gap-2 text-slate-600 hover:underline focus-visible:underline dark:text-dark-text',
            // 처음 그릴 때는 움직이지 않고, 바뀔 때만 아래에서 올라온다
            prev !== null &&
              'duration-500 animate-in fade-in slide-in-from-bottom-full motion-reduce:animate-none',
          )}
        >
          <NoticeLine notice={notice} />
        </Link>
      </div>
      {count > 1 && (
        <span className='shrink-0 text-xs tabular-nums text-slate-400 dark:text-dark-subtle'>
          <span className='sr-only'>전체 {count}개 중 </span>
          {current + 1}/{count}
        </span>
      )}
    </section>
  )
}
