'use client'

import { useState } from 'react'
import { type ErrorInfo } from '@/entities/speller'
import { Button } from '@/shared/ui/button'
import { BulletBadge } from '@/shared/ui/bullet-badge'
import EditIcon from '@/shared/ui/icon/icon-edit.svg'
import SendIcon from '@/shared/ui/icon/icon-send-gray.svg'
import ArrowBottomIcon from '@/shared/ui/icon/icon-arrow-bottom.svg'
import { cn } from '@/shared/lib/tailwind-merge'
import { ReportForm } from './report-form'
import { CustomTextEditor } from './custom-text-editor'

interface ErrorInfoSectionProps {
  errorInfo: ErrorInfo
}

const ErrorInfoSection = ({ errorInfo }: ErrorInfoSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const { correctMethod, orgStr, candWord, help } = errorInfo ?? {}
  const candidateWords = candWord.split('|').map((word, id) => ({ id, word }))

  return (
    <div className='my-[1.125rem]'>
      <dl className='grid grid-cols-[3.5rem_1fr] gap-3 tab:grid-cols-[4.75rem_1fr] pc:grid-cols-[4.5rem_1fr] pc:gap-1'>
        <dt className='py-0.5 text-sm font-semibold tab:text-lg'>입력 내용</dt>
        <dd className='flex items-center justify-between'>
          <p className='flex items-center gap-2 text-base font-semibold tab:gap-3.5 tab:text-xl'>
            <BulletBadge
              method={correctMethod}
              className='mx-1.5 h-3 w-3 tab:mx-2.5'
            />
            {orgStr}
          </p>
          <ReportForm>
            <Button
              variant='ghost'
              className='h-auto p-0 text-slate-500 hover:bg-transparent pc:gap-2'
            >
              <SendIcon className='!h-6 !w-6 tab:!h-8 tab:!w-8' />
              <span className='sr-only font-medium tab:not-sr-only tab:text-lg'>
                오류 제보
              </span>
            </Button>
          </ReportForm>
        </dd>
        <dt className='py-0.5 text-sm font-semibold tab:text-lg'>대치어</dt>
        <dd>
          <CustomTextEditor wrongWord='이들 요소들을'>
            <div className='flex items-center justify-between text-[0]'>
              <Button
                variant='ghost'
                className='h-auto p-0 text-base font-medium text-slate-500 hover:bg-transparent tab:gap-4 tab:text-lg pc:gap-4'
              >
                <EditIcon className='!size-6 tab:!size-8' />
                대치어 직접 수정하기
              </Button>
            </div>
          </CustomTextEditor>
          <div className='mt-2 flex max-h-[5.625rem] flex-col overflow-y-auto rounded-lg border border-slate-200 bg-slate-100 p-2 tab:mt-3 tab:max-h-[6rem] pc:max-h-[6.5rem]'>
            {candidateWords.map(({ id, word }) => (
              <Button
                key={id}
                variant={null}
                className='h-auto justify-start p-0 text-base font-medium hover:underline tab:text-base pc:text-lg'
              >
                {word}
              </Button>
            ))}
          </div>
        </dd>
        <dt className='py-0.5 text-sm font-semibold tab:text-lg pc:mt-1'>
          도움말
        </dt>
        <dd>
          <div
            className={cn(
              'relative max-h-[4.5rem] overflow-hidden transition-[max-height,padding-bottom] duration-300 tab:max-h-[3.5rem] pc:mt-2 pc:max-h-12',
              isExpanded && '!max-h-full pb-6 tab:pb-7 pc:pb-6',
            )}
          >
            <p
              className='text-base tab:text-lg pc:text-base'
              dangerouslySetInnerHTML={{ __html: help }}
            />
            <Button
              variant={null}
              className={cn(
                'absolute bottom-0 right-0 h-6 gap-1 rounded-none bg-white p-0 text-sm font-normal text-slate-600 underline before:absolute before:bottom-0 before:right-full before:h-full before:w-full before:bg-gradient-to-r before:from-transparent before:to-white before:content-[""] tab:h-7 tab:text-base pc:h-auto',
                isExpanded && 'text-slate-400',
              )}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '접기' : '자세히 보기'}
              <ArrowBottomIcon
                className={cn('!size-6', isExpanded ? 'rotate-180' : '')}
              />
            </Button>
          </div>
        </dd>
      </dl>
    </div>
  )
}

export { ErrorInfoSection }
