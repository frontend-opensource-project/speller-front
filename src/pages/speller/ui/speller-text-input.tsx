'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSpeller } from '@/entities/speller'
import { usePersistRehydrated } from '@/shared/lib/use-redux'
import { ScrollGradientFade } from '@/shared/ui/scroll-gradient-fade'
import { Textarea, TextareaHandle } from '@/shared/ui/textarea'
import { Button } from '@/shared/ui/button'
import { sendButtonClickedEvent } from '@/shared/lib/send-ga-event'

const SpellerTextInput = () => {
  const textareaRef = useRef<TextareaHandle>(null)
  const { originalText, handleOriginalTextChange } = useSpeller()
  const isRehydrated = usePersistRehydrated()
  const [showGradient, setShowGradient] = useState(false)

  const handleOnClear = useCallback(() => {
    if (!textareaRef.current) return

    textareaRef.current.textClear()

    sendButtonClickedEvent({
      buttonType: 'remove',
    })
  }, [])

  const handleScroll = useCallback(
    (isScrolling: boolean) => setShowGradient(isScrolling),
    [],
  )

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // 세션 스토리지 복원이 끝난 뒤에 직전 입력값을 되살린다.
  // (PersistGate 로 렌더링을 막지 않기 때문에 복원 시점을 따로 기다려야 한다)
  useEffect(() => {
    if (!isRehydrated || !textareaRef.current) return

    textareaRef.current.hydrateText(originalText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRehydrated])

  return (
    <>
      <div className='mb-2 flex justify-between pc:mb-3'>
        <h2 className='text-[1.125rem] font-semibold leading-[1.9125rem] tracking-[-0.0225rem] text-slate-600 dark:text-dark-text tab:text-[1.375rem] tab:leading-[2.3375rem] tab:tracking-[-0.0275rem] pc:text-[1.5rem] pc:leading-[2.55rem] pc:tracking-[-0.03rem]'>
          원문
        </h2>
        <div className='flex size-6 shrink-0 rounded-md p-1 hover:bg-accent tab:size-7 pc:size-8'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleOnClear}
            aria-label='문장 삭제'
            className='relative size-full self-center outline-none hover:bg-transparent focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-dark-border dark:focus-visible:ring-offset-dark-surface'
            type='button'
          >
            <Image className='object-cover' src='/close.svg' fill alt='' />
          </Button>
        </div>
      </div>
      {/* 텍스트 입력 */}
      <div className='min-w-0 flex-1'>
        <Textarea
          ref={textareaRef}
          name='speller-text'
          onChange={handleOriginalTextChange}
          onScroll={handleScroll}
          placeholder='내용을 입력해 주세요.'
        />
        {/* 스크롤 시 그라디언트 블러 도형 표시 */}
        <ScrollGradientFade showGradient={showGradient} />
      </div>
    </>
  )
}

export { SpellerTextInput }
