'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createQaBoardAction } from '../api/qa-board-actions'
import type { QaBoardWriteActionState } from '../api/qa-board-actions'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { ContentLayout } from '@/shared/ui/content-layout'
import { cn } from '@/shared/lib/tailwind-merge'

const initialState: QaBoardWriteActionState = {
  success: false,
}

export function QaBoardWritePage() {
  const [state, formAction, isPending] = useActionState(
    createQaBoardAction,
    initialState,
  )

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
            action={formAction}
            className='rounded-lg border border-slate-200 bg-white p-5 tab:p-6'
          >
            <div className='flex flex-col gap-6'>
              {/* 전체 에러 메시지 */}
              {state.error && (
                <div className='border-red-200 bg-red-50 text-red-600 rounded-lg border p-4 text-sm'>
                  {state.error}
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
                  required
                />
                {state.errors?.author && (
                  <p className='text-red-600 text-sm'>
                    {state.errors.author[0]}
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
                />
                {state.errors?.email && (
                  <p className='text-red-600 text-sm'>
                    {state.errors.email[0]}
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
                  required
                />
                {state.errors?.password && (
                  <p className='text-red-600 text-sm'>
                    {state.errors.password[0]}
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
                  placeholder='질문 제목을 입력하세요 (최소 5자)'
                  disabled={isPending}
                  required
                />
                {state.errors?.title && (
                  <p className='text-red-600 text-sm'>
                    {state.errors.title[0]}
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
                  required
                  className={cn(
                    'flex min-h-[200px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    'resize-none',
                  )}
                />
                {state.errors?.content && (
                  <p className='text-red-600 text-sm'>
                    {state.errors.content[0]}
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
