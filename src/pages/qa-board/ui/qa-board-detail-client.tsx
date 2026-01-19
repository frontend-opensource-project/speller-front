'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, MessageCircle, Pencil, Trash2 } from 'lucide-react'
import type { QaBoardAnswer, QaBoardDetail } from '../model/qa-board-schema'
import {
  replyQaBoardAction,
  updateQaBoardAction,
  deleteQaBoardAction,
} from '../api/qa-board-actions'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { ContentLayout } from '@/shared/ui/content-layout'
import { cn } from '@/shared/lib/tailwind-merge'

interface QaBoardDetailClientProps {
  data: QaBoardDetail
}

type ModalType = 'reply' | 'edit' | 'delete' | null

interface ModalTarget {
  type: 'question' | 'answer'
  id: number
  step?: number
  reLevel?: number
}

export function QaBoardDetailClient({ data }: QaBoardDetailClientProps) {
  const router = useRouter()
  const [modalType, setModalType] = useState<ModalType>(null)
  const [modalTarget, setModalTarget] = useState<ModalTarget | null>(null)
  const [password, setPassword] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [replyAuthor, setReplyAuthor] = useState('')
  const [editTitle, setEditTitle] = useState(data.title)
  const [editContent, setEditContent] = useState(data.content)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isAnswered = data.status === 'answered'
  const date = data.createdAt

  const closeModal = () => {
    setModalType(null)
    setModalTarget(null)
    setPassword('')
    setReplyContent('')
    setReplyAuthor('')
    setEditTitle(data.title)
    setEditContent(data.content)
    setError(null)
  }

  const openReplyModal = (target: ModalTarget) => {
    setModalTarget(target)
    setModalType('reply')
  }

  const openEditModal = (target: ModalTarget) => {
    setModalTarget(target)
    if (target.type === 'question') {
      setEditTitle(data.title)
      setEditContent(data.content)
    } else {
      const answer = data.answers.find(a => a.id === target.id)
      if (answer) {
        setEditTitle('')
        setEditContent(answer.content)
      }
    }
    setModalType('edit')
  }

  const openDeleteModal = (target: ModalTarget) => {
    setModalTarget(target)
    setModalType('delete')
  }

  const handleReply = () => {
    if (!replyAuthor.trim() || replyAuthor.length < 2) {
      setError('작성자 이름은 최소 2자 이상이어야 합니다.')
      return
    }
    if (!replyContent.trim() || replyContent.length < 10) {
      setError('답변 내용은 최소 10자 이상이어야 합니다.')
      return
    }
    if (!password.trim() || password.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.')
      return
    }

    startTransition(async () => {
      // 답변에 대한 답변일 경우 step과 reLevel 증가
      const step =
        modalTarget?.type === 'answer' ? (modalTarget.step || 1) + 1 : 1
      const reLevel =
        modalTarget?.type === 'answer' ? (modalTarget.reLevel || 1) + 1 : 1

      const result = await replyQaBoardAction(
        data.id,
        replyAuthor,
        replyContent,
        password,
        step,
        reLevel,
      )
      if (!result.success) {
        setError(result.error || '답변 등록에 실패했습니다.')
      } else {
        closeModal()
        router.refresh()
      }
    })
  }

  const handleEdit = () => {
    if (!password.trim() || password.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.')
      return
    }
    if (modalTarget?.type === 'question') {
      if (!editTitle.trim() || editTitle.length < 3) {
        setError('제목은 최소 3자 이상이어야 합니다.')
        return
      }
    }
    if (!editContent.trim() || editContent.length < 10) {
      setError('내용은 최소 10자 이상이어야 합니다.')
      return
    }

    startTransition(async () => {
      const targetId = modalTarget?.id || data.id
      const result = await updateQaBoardAction(
        targetId,
        password,
        modalTarget?.type === 'question' ? editTitle : 'RE:',
        editContent,
      )
      if (!result.success) {
        setError(result.error || '수정에 실패했습니다.')
      } else {
        closeModal()
        router.refresh()
      }
    })
  }

  const handleDelete = () => {
    if (!password.trim() || password.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.')
      return
    }

    startTransition(async () => {
      const targetId = modalTarget?.id || data.id
      const result = await deleteQaBoardAction(targetId, password)
      if (!result.success) {
        setError(result.error || '삭제에 실패했습니다.')
      } else {
        if (modalTarget?.type === 'question') {
          router.push('/qa-board')
        } else {
          closeModal()
          router.refresh()
        }
      }
    })
  }

  // 버튼 그룹 컴포넌트
  const ActionButtons = ({
    target,
    showEdit = true,
  }: {
    target: ModalTarget
    showEdit?: boolean
  }) => (
    <div className='flex flex-wrap gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => openReplyModal(target)}
      >
        <MessageCircle className='mr-1 h-4 w-4' />
        답하기
      </Button>
      {showEdit && (
        <Button
          variant='outline'
          size='sm'
          onClick={() => openEditModal(target)}
        >
          <Pencil className='mr-1 h-4 w-4' />
          고치기
        </Button>
      )}
      <Button
        variant='outline'
        size='sm'
        className='text-red-600 hover:bg-red-50 hover:text-red-700'
        onClick={() => openDeleteModal(target)}
      >
        <Trash2 className='mr-1 h-4 w-4' />
        지우기
      </Button>
    </div>
  )

  // 답변 카드 컴포넌트
  const AnswerCard = ({ answer }: { answer: QaBoardAnswer }) => (
    <div
      className='rounded-lg border-2 border-primary/20 bg-primary/5 p-5 tab:p-6'
      style={{ marginLeft: `${Math.min((answer.reLevel - 1) * 20, 60)}px` }}
    >
      <div className='mb-4 flex items-center gap-2'>
        <MessageCircle className='h-5 w-5 text-primary' />
        <h3 className='text-lg font-bold text-primary'>
          {answer.reLevel > 1 ? `답변 (Re: ${answer.reLevel - 1})` : '답변'}
        </h3>
      </div>

      {/* 답변 내용 */}
      <div className='text-slate-700 mb-4 whitespace-pre-wrap rounded-lg bg-white p-4 text-base leading-relaxed tab:text-lg'>
        {answer.content}
      </div>

      {/* 답변 메타 정보 */}
      <div className='mb-4 flex items-center gap-2 text-sm text-slate-500'>
        <span className='font-medium text-primary'>{answer.author}</span>
        <span className='text-slate-300'>|</span>
        <span>{answer.createdAt}</span>
      </div>

      {/* 답변에 대한 버튼 그룹 */}
      <ActionButtons
        target={{
          type: 'answer',
          id: answer.id,
          step: answer.step,
          reLevel: answer.reLevel,
        }}
      />
    </div>
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
            묻고 답하기
          </h1>
        </div>

        {/* 컨텐츠 */}
        <div className='flex flex-col gap-6'>
          {/* 질문 카드 */}
          <div className='rounded-lg border border-slate-200 bg-white p-5 tab:p-6'>
            {/* 제목 영역 */}
            <div className='flex flex-col gap-3 border-b border-slate-200 pb-4'>
              <div className='flex items-start justify-between gap-3'>
                <h2 className='text-slate-900 flex-1 text-xl font-bold tab:text-2xl'>
                  {data.title}
                </h2>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1 text-xs font-medium',
                    isAnswered
                      ? 'bg-primary/10 text-primary'
                      : 'bg-slate-100 text-slate-600',
                  )}
                >
                  {isAnswered ? '답변완료' : '답변대기'}
                </span>
              </div>

              {/* 메타 정보 */}
              <div className='flex flex-wrap items-center gap-2 text-sm text-slate-500 tab:gap-3'>
                <span className='font-medium'>{data.author}</span>
                <span className='text-slate-300'>|</span>
                <span>{date}</span>
                <span className='text-slate-300'>|</span>
                <div className='flex items-center gap-1'>
                  <Eye className='h-4 w-4' />
                  <span>{data.views.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 질문 내용 */}
            <div className='text-slate-700 mt-6 whitespace-pre-wrap text-base leading-relaxed tab:text-lg'>
              {data.content}
            </div>

            {/* 질문에 대한 버튼 그룹 */}
            <div className='mt-6 border-t border-slate-200 pt-4'>
              <ActionButtons target={{ type: 'question', id: data.id }} />
            </div>
          </div>

          {/* 답변 목록 */}
          {data.answers.length > 0 ? (
            <div className='flex flex-col gap-4'>
              {data.answers.map(answer => (
                <AnswerCard key={answer.id} answer={answer} />
              ))}
            </div>
          ) : (
            <div className='bg-slate-50 rounded-lg border border-slate-200 p-8 text-center'>
              <MessageCircle className='mx-auto h-12 w-12 text-slate-300' />
              <p className='mt-3 text-slate-500'>
                아직 답변이 등록되지 않았습니다.
              </p>
              <p className='mt-1 text-sm text-slate-400'>
                빠른 시일 내에 답변 드리겠습니다.
              </p>
            </div>
          )}

          {/* 하단 목록 버튼 */}
          <div className='flex justify-center'>
            <Link href='/qa-board'>
              <Button variant='outline' className='min-w-[100px]'>
                목록으로
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 모달 오버레이 */}
      {modalType && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
            {/* 답하기 모달 */}
            {modalType === 'reply' && (
              <>
                <h3 className='mb-4 text-xl font-bold'>
                  {modalTarget?.type === 'answer'
                    ? '추가 답변 작성'
                    : '답변 작성'}
                </h3>
                {error && (
                  <div className='border-red-400 bg-red-50 text-red-700 mb-4 rounded-lg border-2 p-3 text-sm font-semibold'>
                    {error}
                  </div>
                )}
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='replyAuthor'>작성자</Label>
                    <Input
                      id='replyAuthor'
                      value={replyAuthor}
                      onChange={e => setReplyAuthor(e.target.value)}
                      placeholder='이름을 입력하세요'
                      disabled={isPending}
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='replyContent'>답변 내용</Label>
                    <textarea
                      id='replyContent'
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      placeholder='답변 내용을 입력하세요 (최소 10자)'
                      rows={6}
                      disabled={isPending}
                      className='w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-base placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='replyPassword'>비밀번호</Label>
                    <Input
                      id='replyPassword'
                      type='password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder='수정/삭제 시 필요 (최소 4자)'
                      disabled={isPending}
                    />
                  </div>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      onClick={closeModal}
                      disabled={isPending}
                    >
                      취소
                    </Button>
                    <Button onClick={handleReply} disabled={isPending}>
                      {isPending ? '등록 중...' : '답변 등록'}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* 고치기 모달 */}
            {modalType === 'edit' && (
              <>
                <h3 className='mb-4 text-xl font-bold'>
                  {modalTarget?.type === 'question' ? '질문 수정' : '답변 수정'}
                </h3>
                {error && (
                  <div className='border-red-400 bg-red-50 text-red-700 mb-4 rounded-lg border-2 p-3 text-sm font-semibold'>
                    {error}
                  </div>
                )}
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='editPassword'>비밀번호</Label>
                    <Input
                      id='editPassword'
                      type='password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder='작성 시 입력한 비밀번호'
                      disabled={isPending}
                    />
                  </div>
                  {modalTarget?.type === 'question' && (
                    <div className='flex flex-col gap-2'>
                      <Label htmlFor='editTitle'>제목</Label>
                      <Input
                        id='editTitle'
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        placeholder='제목을 입력하세요'
                        disabled={isPending}
                      />
                    </div>
                  )}
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='editContent'>내용</Label>
                    <textarea
                      id='editContent'
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      placeholder='내용을 입력하세요 (최소 10자)'
                      rows={6}
                      disabled={isPending}
                      className='w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-base placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    />
                  </div>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      onClick={closeModal}
                      disabled={isPending}
                    >
                      취소
                    </Button>
                    <Button onClick={handleEdit} disabled={isPending}>
                      {isPending ? '수정 중...' : '수정하기'}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* 지우기 모달 */}
            {modalType === 'delete' && (
              <>
                <h3 className='text-red-600 mb-4 text-xl font-bold'>
                  {modalTarget?.type === 'question' ? '질문 삭제' : '답변 삭제'}
                </h3>
                {error && (
                  <div className='border-red-400 bg-red-50 text-red-700 mb-4 rounded-lg border-2 p-3 text-sm font-semibold'>
                    {error}
                  </div>
                )}
                <p className='mb-4 text-slate-600'>
                  정말로 이 {modalTarget?.type === 'question' ? '질문' : '답변'}
                  을 삭제하시겠습니까?
                  <br />
                  삭제된 내용은 복구할 수 없습니다.
                </p>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='deletePassword'>비밀번호</Label>
                    <Input
                      id='deletePassword'
                      type='password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder='작성 시 입력한 비밀번호'
                      disabled={isPending}
                    />
                  </div>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      onClick={closeModal}
                      disabled={isPending}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={isPending}
                      className={cn(
                        'transition-colors',
                        password.length >= 4
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-slate-200 text-slate-400',
                      )}
                    >
                      {isPending ? '삭제 중...' : '삭제하기'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ContentLayout>
  )
}
