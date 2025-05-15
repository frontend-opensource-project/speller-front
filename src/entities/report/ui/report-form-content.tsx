import { useSendReport } from '@/entities/report/model/use-send-report'
import { BasicTextarea } from '@/shared/ui/basic-textarea'
import { Button } from '@/shared/ui/button'
import { toast } from '@/shared/lib/use-toast'
import { useInputWithIOSPatch } from '@/shared/lib/use-input-with-ios-patch'

interface ReportFormContentProps {
  handleClose: () => void
}

export const ReportFormContent = ({ handleClose }: ReportFormContentProps) => {
  const { comment, handleChange, handleSubmit } = useSendReport({
    handleClose: () => {
      toast({
        description: '제출되었습니다.',
      })
      handleClose()
    },
  })
  const textareaRef = useInputWithIOSPatch<HTMLTextAreaElement>()

  return (
    <>
      <p className='break-keep text-[0.95rem] text-slate-500 tab:text-lg pc:mb-[1.3rem] pc:mt-[0.85rem] pc:w-[18rem] pc:text-sm pc:leading-normal'>
        대치어가 맞지 않거나, 다른 의견이 있다면 문의하기를 이용해주세요.
      </p>
      <BasicTextarea
        ref={textareaRef}
        placeholder='내용을 작성해주세요.'
        value={comment}
        onChange={handleChange}
        className='scrollbar-none min-h-[141px] resize-none rounded-[0.375rem] border-slate-200 bg-slate-100 p-4 text-[1rem] leading-4 tracking-[-0.02rem] text-slate-600 placeholder:text-slate-300 tab:min-h-[166px] tab:text-base pc:min-h-[9.96rem] pc:p-[0.8rem] pc:text-[1.2rem] pc:text-base pc:leading-[1.2rem]'
      />
      <Button
        disabled={!comment}
        className='h-[2.65rem] py-[0.88rem] text-[0.95rem] tab:h-[3.125rem] tab:text-lg pc:mt-[0.75rem] pc:h-[2.5rem] pc:rounded-[0.42rem] pc:py-[0.7rem] pc:text-base'
        onClick={handleSubmit}
      >
        제출하기
      </Button>
    </>
  )
}
