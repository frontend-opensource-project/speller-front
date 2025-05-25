'use client'

import React from 'react'

import { Button } from '@/shared/ui/button'
import { TextCounter } from '@/shared/ui/text-counter'
import { useSpeller, useStrictCheckQuery } from '@/entities/speller'
import { sendCheckTriggeredEvent } from '@/shared/lib/send-ga-event'

const SpellerControl = () => {
  const isStrict = useStrictCheckQuery()
  const { text } = useSpeller()

  const textLength = text.length
  const isButtonDisabled = textLength <= 0

  return (
    <div className='mt-2 flex flex-shrink-0 justify-between tab:mt-[0.625rem]'>
      <TextCounter count={textLength} />
      <Button
        onClick={() => sendCheckTriggeredEvent({ textLength, isStrict })}
        type='submit'
        variant='action'
        className='h-[3.375rem] w-[8rem] pc:h-[4.0625rem] pc:w-[9.625rem]'
        disabled={isButtonDisabled}
      >
        검사하기
      </Button>
    </div>
  )
}

export { SpellerControl }
