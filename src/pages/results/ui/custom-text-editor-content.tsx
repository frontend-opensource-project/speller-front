import { getTextMethodColor } from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useUserReplace } from '../model/use-user-replace'
import { BulletBadge } from '../ui/bullet-badge'
import { sendManualCorrectionSubmittedEvent } from '@/shared/lib/send-ga-event'
import { getCorrectedErrorType } from '@/entities/speller/lib/get-corrected-error-type'

interface CustomTextEditorContent {
  handleClose: () => void
}

export const CustomTextEditorContent = ({
  handleClose,
}: CustomTextEditorContent) => {
  const { handleChange, handleEdit, value, errorWord, correctMethod } =
    useUserReplace({
      handleClose,
    })

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <p
          className={cn(
            'flex items-center justify-center text-[0.95rem] tab:text-lg pc:text-base pc:leading-normal',
            `${getTextMethodColor(correctMethod)}`,
          )}
        >
          <BulletBadge
            method={correctMethod}
            className='mx-1.5 tab:size-3 pc:size-2'
          />
          {errorWord}
        </p>
        <div className='h-[1.125rem] w-[1.125rem] bg-chevron-down bg-contain bg-center bg-no-repeat focus-visible:ring-0 pc:h-[0.96rem] pc:w-[0.96rem]' />
      </div>
      <Input
        placeholder='직접 수정해 보세요!'
        className='h-[2.125rem] w-full text-[0.85rem] placeholder:text-slate-300 tab:text-base pc:h-[2.4rem] pc:rounded-[0.36rem] pc:px-[0.42rem] pc:py-[0.17rem] pc:text-base pc:leading-[170%]'
        value={value}
        onChange={handleChange}
      />
      <Button
        disabled={!value}
        className='h-[2.65rem] py-[0.88rem] text-[0.95rem] tab:h-[3.125rem] tab:text-[1.125rem] pc:h-[2.5rem] pc:rounded-[0.31rem] pc:py-[0.84rem] pc:text-base'
        onClick={() => {
          handleEdit()
          sendManualCorrectionSubmittedEvent({
            sectionType: 'correction_item',
            correctedErrorType: getCorrectedErrorType(correctMethod),
            textLength: value.length,
          })
        }}
      >
        수정하기
      </Button>
    </>
  )
}
