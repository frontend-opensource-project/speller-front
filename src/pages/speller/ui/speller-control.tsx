'use client'

import React from 'react'

import { Button } from '@/shared/ui/button'
import { TextCounter } from '@/shared/ui/text-counter'
import { Switch } from '@/shared/ui/switch'
import { useSpeller } from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'
import { sendCheckTriggeredEvent } from '@/shared/lib/send-ga-event'

interface LongModeControl {
  enabled: boolean
  onChange: (value: boolean) => void
  pageCount: number // 입력한 글을 서버 규칙으로 나눈 구간 수
}

interface SpellerControlProps {
  longMode?: LongModeControl // 긴글 모드를 쓸 수 있을 때만 (플래그 ON · PC)
}

const SpellerControl = ({ longMode }: SpellerControlProps) => {
  const { originalText, isStrictCheck } = useSpeller()
  const textLength = originalText?.length ?? 0
  const isButtonDisabled = textLength <= 0
  const isLongText = !!longMode && longMode.pageCount >= 2

  return (
    <div className='mt-2 flex flex-shrink-0 justify-between tab:mt-[0.625rem]'>
      <TextCounter count={textLength} />
      <div className='flex items-center gap-5'>
        {longMode && (
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
              isLongText &&
                !longMode.enabled &&
                'bg-blue-100/30 ring-2 ring-blue-500 dark:bg-blue-500/20',
            )}
          >
            {isLongText && (
              <span className='text-base text-slate-600 dark:text-dark-text'>
                {longMode.enabled
                  ? `긴글 모드로 검사합니다 (${longMode.pageCount}구간)`
                  : '긴 글은 긴글 모드로 보이는 부분부터 빠르게 검사해 보세요'}
              </span>
            )}
            <label className='flex cursor-pointer items-center gap-2 text-base font-medium text-slate-600 dark:text-dark-text pc:text-xl'>
              긴글 모드
              <Switch
                checked={longMode.enabled}
                onCheckedChange={longMode.onChange}
              />
            </label>
          </div>
        )}
        <Button
          onClick={() => sendCheckTriggeredEvent({ textLength, isStrictCheck })}
          type='submit'
          variant='action'
          className='h-[3.375rem] w-[8rem] pc:h-[4.0625rem] pc:w-[9.625rem]'
          disabled={isButtonDisabled}
        >
          검사하기
        </Button>
      </div>
    </div>
  )
}

export { SpellerControl }
