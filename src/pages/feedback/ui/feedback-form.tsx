'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { TextCounter } from '@/shared/ui/text-counter'
import { Textarea } from '@/shared/ui/textarea'
import { feedbackReportAction } from '../api/feedback-report-action'

const FeedbackForm = () => {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [state, formAction, isPending] = useActionState(feedbackReportAction, {
    data: null,
    error: null,
  })
  const isButtonDisabled = content.length <= 0 || isPending

  useEffect(() => {
    if (state.data) {
      router.push(
        `/feedback/submitted?content=${encodeURIComponent(state.data)}`,
      )
    }

    // TODO: Error Boundary 적용
    if (state.error) {
      console.error(state.error)
    }
  }, [state, router])

  return (
    <form className='flex grid-cols-1 flex-col' action={formAction}>
      {/* 문의 내용 */}
      <div className='mt-2 flex flex-col gap-3 pc:mt-[1.125rem] pc:grid pc:grid-cols-[9.25rem_1fr] pc:gap-0'>
        <FormLabel htmlFor='description' label='문의 내용' />
        <div
          className='flex h-full max-h-[13.75rem] min-h-56 w-full flex-col rounded-lg bg-white px-5 py-4 pc:max-h-[21.25rem] pc:min-h-[21.25rem]'
          id='description'
        >
          <Textarea
            name='feedback-text'
            onChange={text => setContent(text)}
            placeholder='내용을 입력해 주세요.'
            className='text-slate-600 pc:text-xl pc:leading-[160%] pc:tracking-[-0.025rem]'
          />
          <TextCounter count={content.length} className='self-start' />
        </div>
      </div>
      {/* 폼 전송 버튼 */}
      <div className='mt-3 pb-[5.4375rem] text-end tab:mt-4'>
        <Button
          className='h-[3.375rem] w-full text-lg tab:w-32 pc:h-16 pc:w-[9.625rem] pc:text-[1.375rem]'
          type='submit'
          variant='action'
          disabled={isButtonDisabled}
        >
          {isPending ? '전송중...' : '전송하기'}
        </Button>
      </div>
    </form>
  )
}

const FormLabel = ({ label, htmlFor }: { label: string; htmlFor: string }) => {
  return (
    <Label
      htmlFor={htmlFor}
      className='text-lg font-semibold leading-[138%] tracking-[-0.0225rem] text-slate-600 after:ml-0.5 after:text-blue-500 after:content-["*"] pc:text-2xl pc:tracking-[-0.03rem]'
    >
      {label}
    </Label>
  )
}

export { FeedbackForm }
