'use client'

import React from 'react'
import Image from 'next/image'
import { useClipboard } from '@frontend-opensource/use-react-hooks'

import { Button } from '@/shared/ui/button'
import { TextCounter } from '@/shared/ui/text-counter'
import { useSpeller } from '@/entities/speller'
import { useRouter } from 'next/navigation'
import { toast } from '@/shared/lib/use-toast'
import { logCopyAction } from '../api/log-copy-action'
import { getWordsAroundIndex } from '@/shared/lib/util'

const ResultsControl = () => {
  const {
    displayText,
    response: { str },
    correctInfo,
  } = useSpeller()
  const router = useRouter()
  const { copyText } = useClipboard()

  const handleCopy = () => {
    copyText(displayText)
    toast({
      description: '복사 완료!\n원하는 곳에 붙여넣어 보세요.',
    })

    const unfixedErrors = Object.values(correctInfo)
      .filter(item => !item?.crtStr)
      .map(item => ({
        errorWord: item.orgStr,
        replaceWord: item.candWord.split('|')[0],
        sentence: getWordsAroundIndex(str, item.start),
      }))
    logCopyAction(unfixedErrors)
  }

  return (
    <div className='flex flex-shrink-0 justify-between pt-5'>
      <TextCounter count={str.length} className='pc:-translate-y-3' />
      <div className='flex gap-3'>
        <ActionButton
          icon='/arrow-return-left.svg'
          label='돌아가기'
          ariaLabel='페이지 돌아가기'
          onClick={() => router.back()}
        />
        <ActionButton
          icon='/copy.svg'
          label='복사하기'
          ariaLabel='텍스트 복사하기'
          onClick={handleCopy}
        />
      </div>
    </div>
  )
}

type ActionButtonProps = {
  icon: string
  label: string
  ariaLabel: string
  onClick?: () => void
}

const ActionButton = ({
  icon,
  label,
  ariaLabel,
  onClick,
}: ActionButtonProps) => (
  <Button
    variant='ghost'
    aria-label={ariaLabel}
    onClick={onClick}
    className='size-fit p-1 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white'
  >
    <div className='flex flex-col items-center justify-center'>
      <div className='relative size-[1.5rem]'>
        <Image
          className='object-contain'
          src={icon}
          fill
          alt=''
          aria-hidden='true'
        />
      </div>
      <p className='text-[1rem] font-medium leading-[1.6rem] text-slate-400'>
        {label}
      </p>
    </div>
  </Button>
)

export { ResultsControl }
