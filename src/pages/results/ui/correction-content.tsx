'use client'

import React from 'react'

import { SpellingCorrectionText } from './spelling-correction-text'
import { ScrollGradientFade } from '@/shared/ui/scroll-gradient-fade'
import { ScrollContainer } from '@/shared/ui/scroll-container'
import { useSpellerRefs } from '@/entities/speller'

const CorrectionContent = () => {
  const { correctScrollContainerRef } = useSpellerRefs()

  return (
    <>
      {/* 교정 문서 텍스트*/}
      <div className='mb-[1rem] flex justify-between tab:mb-[1.25rem]'>
        <h2 className='text-lg font-semibold leading-[1.9125rem] tracking-[-0.0225rem] tab:text-[1.375rem] tab:leading-[2.3375rem] tab:tracking-[-0.0275rem] pc:text-[1.5rem] pc:leading-[2.55rem] pc:tracking-[-0.03rem]'>
          교정 문서
        </h2>
      </div>
      {/* 교정 텍스트 */}
      <div className='min-w-0 flex-1'>
        <ScrollContainer
          ref={correctScrollContainerRef}
          className='h-full min-h-40 flex-1'
          renderGradient={isScrolling => (
            <ScrollGradientFade showGradient={isScrolling} />
          )}
        >
          <SpellingCorrectionText />
        </ScrollContainer>
      </div>
    </>
  )
}

export { CorrectionContent }
