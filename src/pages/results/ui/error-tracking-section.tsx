'use client'

import { Fragment, useCallback, useState } from 'react'
import { useSpeller } from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'
import { BulletBadge } from '@/shared/ui/bullet-badge'
import { ScrollContainer } from '@/shared/ui/scroll-container'
import { ScrollGradientFade } from '@/shared/ui/scroll-gradient-fade'
import { ErrorInfoSection } from './error-info-section'

const ErrorTrackingSection = () => {
  const { response } = useSpeller()
  const { errInfo } = response ?? {}

  const [showGradient, setShowGradient] = useState(false)

  const handleScroll = useCallback((isScrolling: boolean) => {
    setShowGradient(isScrolling)
  }, [])

  return (
    <>
      <h2 className='z-10 flex items-center gap-1 bg-white pb-[1.125rem] text-lg font-semibold tab:text-xl pc:text-2xl'>
        맞춤법/문법 오류
        <span className='text-red-100'>{errInfo.length}개</span>
      </h2>
      <ScrollContainer
        onScrollStatusChange={handleScroll}
        className='-mt-[1.125rem]'
      >
        {errInfo.map((info, i) => (
          <Fragment key={info.errorIdx}>
            <hr className={cn('border-slate-200', i === 0 && 'hidden')} />
            <ErrorInfoSection errorInfo={info} />
          </Fragment>
        ))}
      </ScrollContainer>
      <div>
        <ScrollGradientFade showGradient={showGradient} />
        <div className='flex items-center gap-4 text-sm font-medium'>
          <span className='flex items-center gap-2 tab:text-lg'>
            <BulletBadge method={1} className='tab:size-3' />
            띄어쓰기 오류
          </span>
          <span className='flex items-center gap-2 tab:text-lg'>
            <BulletBadge method={2} className='tab:size-3' />
            오탈자 오류
          </span>
          <span className='flex items-center gap-2 tab:text-lg'>
            <BulletBadge method={3} className='tab:size-3' />
            문맥상 오류
          </span>
        </div>
      </div>
    </>
  )
}

export { ErrorTrackingSection }
