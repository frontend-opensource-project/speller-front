'use client'

import { Fragment } from 'react'
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

  return (
    <>
      <div className='mb-[1rem] flex justify-between tab:mb-[1.25rem]'>
        <h2 className='flex gap-2 text-lg font-semibold leading-[1.9125rem] tracking-[-0.0225rem] tab:text-[1.375rem] tab:leading-[2.3375rem] tab:tracking-[-0.0275rem] pc:text-[1.5rem] pc:leading-[2.55rem] pc:tracking-[-0.03rem]'>
          맞춤법/문법 오류
          <span className='text-red-100'>{errInfo.length}개</span>
        </h2>
      </div>
      <ScrollContainer
        ref={errorScrollContainerRef}
        className='flex-1'
        renderGradient={isScrolling => (
          <ScrollGradientFade showGradient={isScrolling} />
        )}
      >
        <div>
          {errInfo.map((info, idx) => (
            <Fragment key={info.errorIdx}>
              <hr className={cn('border-slate-200', idx === 0 && 'hidden')} />
              <ErrorInfoSection
                errorInfo={info}
                ref={el => {
                  if (!errorRefs || !el) return
                  errorRefs.current[idx] = el
                }}
                onMouseOver={() => scrollSection('correct', idx)}
              />
            </Fragment>
          ))}
        </div>
      </ScrollContainer>
      <div className='flex items-center gap-4 pt-5 text-sm font-medium pc:-translate-y-5 pc:justify-between pc:gap-0 pc:@[23.125rem]:justify-normal pc:@[23.125rem]:gap-4'>
        <span className='flex items-center gap-2 tab:text-lg pc:gap-1 pc:@[23.125rem]:gap-2'>
          <BulletBadge
            method={CorrectMethodEnum.enum.띄어쓰기}
            className='tab:size-3'
          />
          띄어쓰기 오류
        </span>
        <span className='flex items-center gap-2 tab:text-lg pc:gap-1 pc:@[23.125rem]:gap-2'>
          <BulletBadge
            method={CorrectMethodEnum.enum.오탈자}
            className='tab:size-3'
          />
          오탈자 오류
        </span>
        <span className='flex items-center gap-2 tab:text-lg pc:gap-1 pc:@[23.125rem]:gap-2'>
          <BulletBadge
            method={CorrectMethodEnum.enum.문맥}
            className='tab:size-3'
          />
          문맥상 오류
        </span>
      </div>
    </>
  )
}

export { ErrorTrackingSection }
