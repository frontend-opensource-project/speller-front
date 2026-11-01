'use client'

import { FormEvent, RefObject, useEffect, useState } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { XIcon } from 'lucide-react'
import {
  BulletBadge,
  CorrectMethodEnum,
  HelpSection,
  getTextMethodColor,
  parseCandidateWords,
  type CorrectInfo,
} from '@/entities/speller'
import { PopoverContent } from '@/shared/ui/popover'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { BasicTextarea } from '@/shared/ui/basic-textarea'
import { toast } from '@/shared/lib/use-toast'
import { cn } from '@/shared/lib/tailwind-merge'
import type { ErrorGroup } from '../lib/group-errors'
import type { useLongCorrections } from '../model/use-long-corrections'
import { sendReport } from '../api/long-logs'

const METHOD_LABEL: Record<number, string> = {
  [CorrectMethodEnum.enum.어법]: '어법 오류',
  [CorrectMethodEnum.enum.문맥]: '문맥상 오류',
  [CorrectMethodEnum.enum.흔한실수]: '흔한 실수',
  [CorrectMethodEnum.enum.분석실패]: '분석 실패',
}

interface LongErrorOverlayProps {
  anchorRef: RefObject<HTMLElement | null> // 문서에서 선택된 오류어 요소
  open: boolean
  onOpenChange: (open: boolean) => void
  pageIdx: number
  info: CorrectInfo
  pageText: string
  isIgnored: boolean
  group: ErrorGroup | null // 같은 묶음 (모두 수정 · 모두 무시)
  corrections: ReturnType<typeof useLongCorrections>
}

/** 오류어를 누르면 그 자리에 뜨는 오류 정보창 */
const LongErrorOverlay = ({
  anchorRef,
  open,
  onOpenChange,
  pageIdx,
  info,
  pageText,
  isIgnored,
  group,
  corrections,
}: LongErrorOverlayProps) => {
  const ref = { pageIdx, info }
  const candidates = parseCandidateWords(info.candWord).filter(c => c.word)
  const isCorrected = info.crtStr !== undefined
  const [customWord, setCustomWord] = useState('')
  const [confirmBulk, setConfirmBulk] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [comment, setComment] = useState('')

  // 다른 오류로 바뀌면 입력 중이던 값을 비운다
  useEffect(() => {
    setCustomWord('')
    setConfirmBulk(false)
    setIsReporting(false)
    setComment('')
  }, [pageIdx, info.errorIdx])

  const remaining = group?.remaining ?? 0
  const showGroupActions = !!group && group.items.length > 1 && remaining > 0
  // 문맥 오류는 위치마다 맞는 대치어가 다를 수 있어 한 번 더 확인한다
  const needsConfirm = info.correctMethod === CorrectMethodEnum.enum.문맥

  const handleCorrectGroup = () => {
    if (!group) return
    if (needsConfirm && !confirmBulk) {
      setConfirmBulk(true)
      return
    }
    const count = corrections.correctGroup(group)
    setConfirmBulk(false)
    toast({
      description: `${count}곳을 "${group.firstCandidate}"(으)로 고쳤습니다.`,
    })
  }

  const handleIgnoreGroup = () => {
    if (!group) return
    const count = corrections.ignoreGroup(group)
    toast({ description: `${count}곳을 무시했습니다.` })
  }

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault()
    const word = customWord.trim()
    if (!word) return
    corrections.replaceByUser(ref, word)
    setCustomWord('')
  }

  const handleReport = async () => {
    try {
      await sendReport(pageText, info, comment)
      toast({ description: '제출되었습니다.' })
      setIsReporting(false)
      setComment('')
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description:
          '서버 처리 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
      })
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Anchor virtualRef={anchorRef} />
      <PopoverContent
        side='bottom'
        align='start'
        sideOffset={6}
        collisionPadding={16}
        className='max-h-[min(36rem,70vh)] w-[22rem] overflow-y-auto rounded-2xl p-4'
        // 문서의 다른 오류어를 누르면 닫히지 않고 그 오류로 바뀐다
        onInteractOutside={e => {
          const target = e.target as HTMLElement | null
          if (target?.closest('[data-error-idx]')) e.preventDefault()
        }}
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-2 text-sm text-slate-500 dark:text-dark-subtle'>
            <BulletBadge method={info.correctMethod} className='size-2.5' />
            {METHOD_LABEL[info.correctMethod] ?? '오류'}
            {isCorrected && <span className='text-blue-500'>· 수정함</span>}
            {isIgnored && <span>· 무시함</span>}
          </div>
          <button
            type='button'
            aria-label='닫기'
            className='text-slate-400 hover:text-slate-600 dark:text-dark-subtle'
            onClick={() => onOpenChange(false)}
          >
            <XIcon className='size-4' />
          </button>
        </div>

        <p
          className={cn(
            'mt-2 whitespace-pre-wrap break-all text-lg font-bold',
            getTextMethodColor(info.correctMethod),
          )}
        >
          {info.orgStr}
        </p>

        <section className='mt-3'>
          <h3 className='mb-1 text-sm font-semibold'>대치어</h3>
          {candidates.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {candidates.map(({ id, word }) => (
                <Button
                  key={id}
                  size='sm'
                  variant={info.crtStr === word ? 'default' : 'outline'}
                  className='h-auto min-h-8 whitespace-pre-wrap break-all text-left text-base'
                  onClick={() => corrections.choose(ref, word)}
                >
                  {word}
                </Button>
              ))}
            </div>
          ) : (
            <p className='text-sm text-slate-400 dark:text-dark-subtle'>
              제안된 대치어가 없습니다.
            </p>
          )}
          <form onSubmit={handleCustomSubmit} className='mt-2 flex gap-2'>
            <Input
              value={customWord}
              onChange={e => setCustomWord(e.target.value)}
              placeholder='직접 수정해 보세요'
              aria-label='대치어 직접 입력'
              className='h-8 text-base'
            />
            <Button type='submit' size='sm' disabled={!customWord.trim()}>
              수정
            </Button>
          </form>
        </section>

        <div className='mt-3 flex flex-wrap gap-2'>
          {isCorrected || isIgnored ? (
            <Button
              size='sm'
              variant='outline'
              onClick={() => corrections.revert(ref)}
            >
              {isIgnored ? '무시 취소' : '원래대로'}
            </Button>
          ) : (
            <Button
              size='sm'
              variant='outline'
              onClick={() => corrections.ignore([ref])}
            >
              무시
            </Button>
          )}
          {showGroupActions && (
            <>
              <Button
                size='sm'
                variant={confirmBulk ? 'default' : 'secondary'}
                onClick={handleCorrectGroup}
                disabled={!group.firstCandidate}
              >
                {confirmBulk
                  ? `정말 ${remaining}곳을 모두 바꿀까요?`
                  : `같은 오류 모두 수정 (${remaining}곳)`}
              </Button>
              <Button size='sm' variant='secondary' onClick={handleIgnoreGroup}>
                모두 무시 ({remaining}곳)
              </Button>
            </>
          )}
        </div>
        {confirmBulk && (
          <p className='mt-1 text-xs text-slate-500 dark:text-dark-subtle'>
            문맥상 오류는 위치마다 맞는 대치어가 다를 수 있습니다.
          </p>
        )}

        {info.help && (
          <section className='mt-3 border-t border-slate-200 pt-3 dark:border-dark-border'>
            <h3 className='mb-1 text-sm font-semibold'>도움말</h3>
            <HelpSection help={info.help} correctMethod={info.correctMethod} />
          </section>
        )}

        <section className='mt-3 border-t border-slate-200 pt-3 dark:border-dark-border'>
          {isReporting ? (
            <div className='grid gap-2'>
              <p className='text-sm text-slate-500 dark:text-dark-subtle'>
                대치어가 맞지 않거나 다른 의견이 있으면 알려 주세요.
              </p>
              <BasicTextarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder='내용을 작성해 주세요.'
                className='min-h-24 resize-none rounded-md border-slate-200 bg-slate-100 p-3 text-sm dark:border-dark-border dark:bg-dark-elevated'
              />
              <div className='flex justify-end gap-2'>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => setIsReporting(false)}
                >
                  취소
                </Button>
                <Button size='sm' disabled={!comment} onClick={handleReport}>
                  제출하기
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size='sm'
              variant='ghost'
              className='px-0 text-slate-500 dark:text-dark-subtle'
              onClick={() => setIsReporting(true)}
            >
              오류 제보
            </Button>
          )}
        </section>
      </PopoverContent>
    </PopoverPrimitive.Root>
  )
}

export { LongErrorOverlay, METHOD_LABEL }
