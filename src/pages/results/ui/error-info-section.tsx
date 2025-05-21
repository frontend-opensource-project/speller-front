'use client'

import { XIcon } from 'lucide-react'

import {
  useSpeller,
  type ErrorInfo,
  parseCandidateWords,
} from '@/entities/speller'
import { ReportForm } from '@/entities/report'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/tailwind-merge'
import EditIcon from '@/shared/ui/icon/icon-edit.svg'
import SendIcon from '@/shared/ui/icon/icon-send-gray.svg'
import { HelpSection } from './help-section'
import { CustomTextEditor } from './custom-text-editor'
import { logClickReplaceAction } from '../api/log-click-replace-action'
import { extractContext } from '../lib/extractContext'
import { BulletBadge } from '../ui/bullet-badge'
import { sendCorrectionWordClickedEvent } from '@/shared/lib/send-ga-event'
import { getCorrectedErrorType } from '@/entities/speller/lib/get-corrected-error-type'

interface ErrorInfoSectionProps<T>
  extends React.RefAttributes<T>,
    React.HTMLAttributes<T> {
  errorInfo: ErrorInfo
}

const ErrorInfoSection = <T extends HTMLDivElement>({
  errorInfo,
  ...props
}: ErrorInfoSectionProps<T>) => {
  const { response, correctInfo, handleUpdateCorrectInfo, updateErrInfoIndex } =
    useSpeller()
  const { errorIdx, correctMethod, orgStr, candWord, help } = errorInfo ?? {}
  const candidateWords = parseCandidateWords(candWord)

  const handleClickReplace = (replaceWord: string) => {
    const sentence = extractContext(response.str, errorInfo, replaceWord)
    logClickReplaceAction({
      errorWord: orgStr,
      replaceWord,
      sentence,
      wordList: candWord,
    })
  }

  const handleRevert = () => {
    handleUpdateCorrectInfo({ ...errorInfo, crtStr: orgStr })
    sendCorrectionWordClickedEvent({
      sectionType: 'correction_item',
      wordTextType: 'suggested',
      correctedErrorType: getCorrectedErrorType(correctMethod),
    })
  }

  return (
    <div className={cn('my-[1.125rem]', errorIdx === 0 && 'mt-0')} {...props}>
      <dl className='grid grid-cols-[3.5rem_1fr] gap-3 tab:grid-cols-[4.75rem_1fr] pc:grid-cols-[4.5rem_1fr] pc:gap-1'>
        <dt className='py-0.5 text-sm font-semibold tab:text-lg'>입력 내용</dt>
        <dd className='flex items-start justify-between gap-2'>
          <Button
            variant='ghost'
            className='flex h-auto items-start gap-2 p-0 text-base font-semibold hover:bg-transparent tab:gap-3.5 tab:text-xl'
            onClick={handleRevert}
          >
            <BulletBadge
              method={correctMethod}
              className='mx-1.5 my-[0.3125rem] size-3 shrink-0 tab:mx-2.5 tab:my-2'
            />
            <span className='block whitespace-pre-line break-all text-left'>
              {orgStr}
            </span>
          </Button>
          <ReportForm>
            <Button
              variant='ghost'
              className='h-auto p-0 text-slate-500 hover:bg-transparent pc:gap-2'
              onClick={() => updateErrInfoIndex(errorIdx)}
            >
              <SendIcon className='!size-6 tab:!size-8' />
              <span className='sr-only font-normal tab:not-sr-only tab:whitespace-nowrap tab:text-lg'>
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
                onClick={() => updateErrInfoIndex(errorIdx)}
              >
                <EditIcon className='!size-6 tab:!size-8' />
                대치어 직접 수정하기
              </Button>
            </div>
          </CustomTextEditor>
          <div className='mt-2 flex max-h-[5.625rem] flex-col overflow-y-auto rounded-lg border border-slate-200 bg-slate-100 p-2 tab:mt-3 tab:max-h-[6rem] pc:max-h-[6.5rem]'>
            {candidateWords.map(({ id, word }) => (
              <div key={id} className='flex items-center gap-[0.43rem]'>
                <Button
                  variant={null}
                  className={cn(
                    'h-auto justify-start p-0 text-base font-medium hover:underline tab:text-base pc:text-lg',
                    correctInfo[errorIdx]?.crtStr === word &&
                      'font-bold text-blue-500',
                  )}
                  onClick={() => {
                    handleUpdateCorrectInfo({ ...errorInfo, crtStr: word })
                    if (id > 0) handleClickReplace(word)
                  }}
                >
                  {word}
                </Button>
                {correctInfo[errorIdx]?.crtStr === word && (
                  <Button
                    size='icon'
                    variant='outline'
                    className='size-[1.125rem] rounded-full border-0 bg-white text-slate-400 shadow-sm hover:bg-white pc:size-5'
                    onClick={() => handleRevert()}
                  >
                    <XIcon className='!w-3 pc:!w-3.5' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </dd>
        <dt className='py-0.5 text-sm font-semibold tab:text-lg pc:mt-1'>
          도움말
        </dt>
        <dd>
          <HelpSection help={help} correctMethod={correctMethod} />
        </dd>
      </dl>
    </div>
  )
}

export { ErrorInfoSection }
