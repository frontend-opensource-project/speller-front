'use client'

import { Fragment, useCallback, useState } from 'react'
import {
  useSpeller,
  CorrectMethodEnum,
  useSpellerRefs,
} from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'
import { ScrollContainer } from '@/shared/ui/scroll-container'
import { ScrollGradientFade } from '@/shared/ui/scroll-gradient-fade'
import { ErrorInfoSection } from './error-info-section'
import { BulletBadge } from '../ui/bullet-badge'

const ErrorTrackingSection = () => {
  const { errorRefs, errorScrollContainerRef, scrollSection } = useSpellerRefs()
  const { response } = useSpeller()
  const { errInfo } = response ?? {}

  const [showGradient, setShowGradient] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleScroll = useCallback((isScrolling: boolean) => {
    setShowGradient(isScrolling)
    setIsFocused(isScrolling)
  }, [])

  return (
    <>
      <h2 className='flex items-center gap-1 pb-[1.125rem] text-lg font-semibold leading-[1.9125rem] tracking-[-0.0225rem] tab:text-[1.375rem] tab:leading-[2.3375rem] tab:tracking-[-0.0275rem] pc:text-[1.5rem] pc:leading-[2.55rem] pc:tracking-[-0.03rem]'>
        맞춤법/문법 오류
        <span className='text-red-100'>{errInfo.length}개</span>
      </h2>
      <ScrollContainer
        isFocused={isFocused}
        ref={errorScrollContainerRef}
        onScrollStatusChange={handleScroll}
        className='-mt-[1.125rem] flex-1'
      >
        <div>
          {errInfo.map((info, idx) => (
            <Fragment key={info.errorIdx}>
              <hr className={cn('border-slate-200', idx === 0 && 'hidden')} />
              <ErrorInfoSection
                errorInfo={info}
                ref={errorRefs?.[idx]}
                onMouseOver={() => scrollSection('correct', idx)}
              />
            </Fragment>
          ))}
        </div>
      </ScrollContainer>
      <div>
        <ScrollGradientFade showGradient={showGradient} />
        <div className='flex items-center gap-4 text-sm font-medium'>
          <span className='flex items-center gap-2 tab:text-lg'>
            <BulletBadge
              method={CorrectMethodEnum.enum.띄어쓰기}
              className='tab:size-3'
            />
            띄어쓰기 오류
          </span>
          <span className='flex items-center gap-2 tab:text-lg'>
            <BulletBadge
              method={CorrectMethodEnum.enum.오탈자}
              className='tab:size-3'
            />
            오탈자 오류
          </span>
          <span className='flex items-center gap-2 tab:text-lg'>
            <BulletBadge
              method={CorrectMethodEnum.enum.문맥}
              className='tab:size-3'
            />
            문맥상 오류
          </span>
        </div>
      </div>
    </>
  )
}

export { ErrorTrackingSection }
