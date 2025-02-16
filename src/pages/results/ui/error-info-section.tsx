'use client'

import { useState } from 'react'
import { useSpeller, type ErrorInfo } from '@/entities/speller'
import { ReportForm } from '@/entities/report'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/tailwind-merge'
import { BulletBadge } from '@/shared/ui/bullet-badge'
import EditIcon from '@/shared/ui/icon/icon-edit.svg'
import SendIcon from '@/shared/ui/icon/icon-send-gray.svg'
import ArrowBottomIcon from '@/shared/ui/icon/icon-arrow-bottom.svg'
import { CustomTextEditor } from './custom-text-editor'

const errInfoIdx = 0 // TODO: props or store

interface ErrorInfoSectionProps<T>
  extends React.RefAttributes<T>,
    React.HTMLAttributes<T> {
  errorInfo: ErrorInfo
}

const ErrorInfoSection = <T extends HTMLDivElement>({
  errorInfo,
  ...props
}: ErrorInfoSectionProps<T>) => {
  const { correctInfo, handleUpdateCorrectInfo, updateErrInfoIndex } =
    useSpeller()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const { errorIdx, correctMethod, orgStr, candWord, help } = errorInfo ?? {}
  const candidateWords = candWord.split('|').map((word, id) => ({ id, word }))

  return (
    <div className={cn('my-[1.125rem]', errorIdx === 0 && 'mt-0')} {...props}>
      <dl className='grid grid-cols-[3.5rem_1fr] gap-3 tab:grid-cols-[4.75rem_1fr] pc:grid-cols-[4.5rem_1fr] pc:gap-1'>
        <dt className='py-0.5 text-sm font-semibold tab:text-lg'>입력 내용</dt>
        <dd className='flex items-center justify-between'>
          <p className='flex items-center gap-2 text-base font-semibold tab:gap-3.5 tab:text-xl'>
            <BulletBadge
              method={correctMethod}
              className='mx-1.5 size-3 tab:mx-2.5'
            />
            {orgStr}
          </p>
          <ReportForm>
            <Button
              variant='ghost'
              className='h-auto p-0 text-slate-500 hover:bg-transparent pc:gap-2'
              onClick={() => updateErrInfoIndex(errInfoIdx)}
            >
              <SendIcon className='!size-6 tab:!size-8' />
              <span className='sr-only font-normal tab:not-sr-only tab:text-lg'>
                오류 제보
              </span>
            </Button>
          </ReportForm>
        </dd>
        <dt className='py-0.5 text-sm font-semibold tab:text-lg'>대치어</dt>
        <dd>
          <CustomTextEditor>
            <div className='flex items-center justify-between text-[0]'>
              <Button
                variant='ghost'
                className='h-auto p-0 text-base font-normal text-slate-500 hover:bg-transparent tab:gap-4 tab:text-lg'
                onClick={() => updateErrInfoIndex(errInfoIdx)}
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
                className={cn(
                  'h-auto justify-start p-0 text-base font-medium hover:underline tab:text-base pc:text-lg',
                  correctInfo[errorIdx]?.crtStr === word &&
                    'font-bold text-blue-500',
                )}
                onClick={() => {
                  handleUpdateCorrectInfo({ ...errorInfo, crtStr: word })
                }}
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
