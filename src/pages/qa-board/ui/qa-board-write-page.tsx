'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createQaBoardAction } from '../api/qa-board-actions'
import { qaBoardWriteSchema } from '../model/qa-board-schema'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { ContentLayout } from '@/shared/ui/content-layout'
import { cn } from '@/shared/lib/tailwind-merge'
import { useRecaptcha } from '@/shared/lib/recaptcha/use-recaptcha'

interface FormErrors {
  title?: string
  content?: string
  author?: string
  email?: string
  password?: string
}

export function QaBoardWritePage() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { execute: executeRecaptcha } = useRecaptcha()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      author: formData.get('author') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // 클라이언트 사이드 Zod 검증
    const validation = qaBoardWriteSchema.safeParse(rawData)

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      setErrors({
        title: fieldErrors.title?.[0],
        content: fieldErrors.content?.[0],
        author: fieldErrors.author?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      })
      return
    }

    // 검증 통과 시 reCAPTCHA 실행 후 서버 액션 호출
    startTransition(async () => {
      try {
        const recaptchaToken = await executeRecaptcha('qa_board_create')
        formData.append('recaptchaToken', recaptchaToken)

        const result = await createQaBoardAction({ success: false }, formData)
        if (!result.success && result.error) {
          setServerError(result.error)
        }
      } catch {
        setServerError('보안 검증에 실패했습니다. 페이지를 새로고침 해주세요.')
      }
    })
  }

  return (
    <ContentLayout>
      <div className='grid h-full flex-1 shrink-0 grid-rows-[auto_1fr] gap-6 px-4 py-6 tab:px-[3.75rem] tab:py-8 pc:px-0'>
        {/* 헤더 */}
        <div className='flex items-center gap-4'>
          <Link href='/qa-board'>
            <Button variant='outline' size='icon'>
              <ArrowLeft className='h-5 w-5' />
            </Button>
          </Link>
          <h1 className='text-slate-900 text-xl font-bold tab:text-2xl'>
            질문 등록
          </h1>
        </div>

        {/* 폼 */}
        <div className='flex flex-col'>
          <form
            onSubmit={handleSubmit}
            className='rounded-lg border border-slate-200 bg-white p-5 tab:p-6'
          >
            <div className='flex flex-col gap-6'>
              {/* 전체 에러 메시지 */}
              {serverError && (
                <div className='border-red-400 bg-red-50 text-red-700 rounded-lg border-2 p-4 text-sm font-semibold'>
                  {serverError}
                </div>
              )}

              {/* 작성자 */}
              <div className='flex flex-col gap-2'>
                <Label htmlFor='author'>
                  작성자 <span className='text-red-600'>*</span>
                </Label>
                <Input
                  id='author'
                  name='author'
                  type='text'
                  placeholder='이름을 입력하세요'
                  disabled={isPending}
                  className={errors.author ? 'border-red-500' : ''}
                />
                {errors.author && (
                  <p className='text-red-600 text-sm font-semibold'>
                    {errors.author}
                  </p>
                )}
              </div>

              {/* 이메일 */}
              <div className='flex flex-col gap-2'>
                <Label htmlFor='email'>이메일 (선택)</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='이메일을 입력하세요'
                  disabled={isPending}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className='text-red-600 text-sm font-semibold'>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div className='flex flex-col gap-2'>
                <Label htmlFor='password'>
                  비밀번호 <span className='text-red-600'>*</span>
                </Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='최소 4자 이상'
                  disabled={isPending}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className='text-red-600 text-sm font-semibold'>
                    {errors.password}
                  </p>
                )}
                <p className='text-xs text-slate-500'>
                  글 수정/삭제 시 필요합니다
                </p>
              </div>

              {/* 제목 */}
              <div className='flex flex-col gap-2'>
                <Label htmlFor='title'>
                  제목 <span className='text-red-600'>*</span>
                </Label>
                <Input
                  id='title'
                  name='title'
                  type='text'
                  placeholder='질문 제목을 입력하세요 (최소 3자)'
                  disabled={isPending}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className='text-red-600 text-sm font-semibold'>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* 내용 */}
              <div className='flex flex-col gap-2'>
                <Label htmlFor='content'>
                  내용 <span className='text-red-600'>*</span>
                </Label>
                <textarea
                  id='content'
                  name='content'
                  placeholder='질문 내용을 자세히 입력하세요 (최소 10자)'
                  rows={10}
                  disabled={isPending}
                  className={cn(
                    'flex min-h-[200px] w-full rounded-md border bg-slate-100 px-3 py-2 text-base ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    'resize-none',
                    errors.content ? 'border-red-500' : 'border-slate-200',
                  )}
                />
                {errors.content && (
                  <p className='text-red-600 text-sm font-semibold'>
                    {errors.content}
                  </p>
                )}
              </div>

              {/* 안내 메시지 */}
              <div className='bg-slate-50 rounded-lg p-4 text-sm text-slate-600'>
                <p className='font-medium'>작성 시 유의사항</p>
                <ul className='ml-4 mt-2 list-disc space-y-1'>
                  <li>구체적이고 명확한 질문을 작성해주세요.</li>
                  <li>욕설이나 비방은 삼가주세요.</li>
                  <li>답변은 영업일 기준 1-2일 내에 등록됩니다.</li>
                </ul>
              </div>

              {/* 버튼 */}
              <div className='flex flex-col gap-3 tab:flex-row tab:justify-end'>
                <Link href='/qa-board' className='tab:order-1'>
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full tab:w-auto'
                    disabled={isPending}
                  >
                    취소
                  </Button>
                </Link>
                <Button
                  type='submit'
                  className='w-full tab:order-2 tab:w-auto tab:min-w-[120px]'
                  disabled={isPending}
                >
                  {isPending ? '등록 중...' : '질문 등록'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ContentLayout>
  )
}
