'use client'

import {
  FormEvent,
  MutableRefObject,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {
  BulletBadge,
  CorrectMethodEnum,
  HelpSection,
  getTextMethodColor,
  parseCandidateWords,
  type CorrectInfo,
} from '@/entities/speller'
import { PopoverContent } from '@/shared/ui/popover'
import SendIcon from '@/shared/ui/icon/icon-send-gray.svg'
import { toast } from '@/shared/lib/use-toast'
import { cn } from '@/shared/lib/tailwind-merge'
import type { ErrorGroup } from '../lib/group-errors'
import type { useLongCorrections } from '../model/use-long-corrections'
import { sendReport } from '../api/long-logs'
import { Kbd } from './kbd'

// 1순위 아래에 바로 보여 줄 다른 대치어 수. 넘으면 '더 보기'로 펼친다
const VISIBLE_ALTS = 5

const METHOD_LABEL: Record<number, string> = {
  [CorrectMethodEnum.enum.어법]: '어법 오류',
  [CorrectMethodEnum.enum.문맥]: '문맥상 오류',
  [CorrectMethodEnum.enum.흔한실수]: '흔한 실수',
  [CorrectMethodEnum.enum.분석실패]: '분석 실패',
}

// 단축키가 지금 정보창의 동작을 부를 때 쓰는 함수들
interface OverlayCommands {
  correctFirst: () => void
  ignore: () => void
  ignoreGroup: () => void
  correctGroup: () => void
  focusCustom: () => void
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
  onPrev: (() => void) | null // 앞 오류가 없으면 null
  onNext: (() => void) | null
  position: { index: number; total: number } | null // 남은 오류 중 몇 번째인지
  commandsRef: MutableRefObject<OverlayCommands | null>
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
  onPrev,
  onNext,
  position,
  commandsRef,
}: LongErrorOverlayProps) => {
  const ref = { pageIdx, info }
  const candidates = parseCandidateWords(info.candWord).filter(c => c.word)
  const isCorrected = info.crtStr !== undefined
  const [customWord, setCustomWord] = useState('')
  const [confirmBulk, setConfirmBulk] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [comment, setComment] = useState('')
  const [showAllAlts, setShowAllAlts] = useState(false)
  const customInputRef = useRef<HTMLInputElement>(null)

  // 다른 오류로 바뀌면 입력 중이던 값을 비운다
  useEffect(() => {
    setCustomWord('')
    setConfirmBulk(false)
    setIsReporting(false)
    setComment('')
    setShowAllAlts(false)
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

  // 무시한 오류는 다시 무시하지 않는다 (/notChange 중복 전송)
  const handleIgnore = () => {
    if (!isIgnored) corrections.ignore([ref])
  }

  const handleCorrectFirst = () => {
    if (candidates[0]) corrections.choose(ref, candidates[0].word)
  }

  commandsRef.current = {
    correctFirst: handleCorrectFirst,
    ignore: handleIgnore,
    ignoreGroup: () => showGroupActions && handleIgnoreGroup(),
    correctGroup: () =>
      showGroupActions && !!group?.firstCandidate && handleCorrectGroup(),
    focusCustom: () => customInputRef.current?.focus(),
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

  const [firstCandidate, ...altCandidates] = candidates
  const visibleAlts = showAllAlts
    ? altCandidates
    : altCandidates.slice(0, VISIBLE_ALTS)

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Anchor virtualRef={anchorRef} />
      <PopoverContent
        side='bottom'
        align='start'
        sideOffset={6}
        collisionPadding={16}
        className='flex max-h-[min(40rem,75vh)] w-[330px] flex-col overflow-y-auto rounded-2xl border-0 bg-white px-[18px] pb-[14px] pt-[18px] text-slate-600 shadow-md dark:bg-dark-surface dark:text-dark-text [&>*]:shrink-0'
        // 문서의 다른 오류어나 묶음 목록의 행을 누르면 닫지 않고 그 오류로 바뀐다.
        // 닫았다 다시 열면 닫는 요청과 여는 요청의 순서에 따라 정보창이 깜빡이거나 닫힌다
        onPointerDownOutside={e => {
          const target = e.target as HTMLElement | null
          if (target?.closest('[data-error-idx], [data-group-key]')) {
            e.preventDefault()
          }
        }}
        // 단축키를 쓰도록 포커스를 문서로 옮기므로 포커스가 나가는 것으로는 닫지 않는다
        onFocusOutside={e => e.preventDefault()}
        onOpenAutoFocus={e => e.preventDefault()}
        // 직접 수정 칸에서 Esc를 누르면 먼저 그 칸만 닫는다
        onEscapeKeyDown={e => {
          if (document.activeElement === customInputRef.current) {
            e.preventDefault()
            setCustomWord('')
            customInputRef.current?.blur()
          }
        }}
        aria-label='오류 정보'
        // 세로 flex라 내용이 길면 overflow-hidden인 도움말이 줄어들어 '자세히 보기'까지 가려진다.
        // 자식은 줄이지 않고 정보창 자체를 스크롤한다 ([&>*]:shrink-0)
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-[14px] font-medium text-slate-500 dark:text-dark-subtle'>
            <BulletBadge method={info.correctMethod} className='size-[10px]' />
            {METHOD_LABEL[info.correctMethod] ?? '오류'}
            {isCorrected && (
              <span className='text-blue-500 dark:text-blue-200'>· 수정함</span>
            )}
            {isIgnored && <span>· 무시함</span>}
          </div>
          <div className='flex items-center gap-[6px]'>
            {position && (
              <span className='mr-1 text-[14px] font-medium tabular-nums text-slate-400 dark:text-dark-subtle'>
                <b className='font-medium text-slate-600 dark:text-dark-text'>
                  {position.index + 1}
                </b>
                /{position.total}
              </span>
            )}
            <IconButton
              label='이전 오류'
              shortcut='←'
              disabled={!onPrev}
              onClick={() => onPrev?.()}
            >
              <CircleArrowIcon />
            </IconButton>
            <IconButton
              label='다음 오류'
              shortcut='→'
              disabled={!onNext}
              onClick={() => onNext?.()}
            >
              <CircleArrowIcon className='rotate-180' />
            </IconButton>
            <IconButton
              label='닫기'
              onClick={() => onOpenChange(false)}
              className='ml-[2px]'
            >
              <i className='size-[14px] bg-close bg-contain bg-center bg-no-repeat' />
            </IconButton>
          </div>
        </div>

        <p
          className={cn(
            'mt-2 whitespace-pre-wrap break-all text-[20px] font-bold tracking-[-0.025rem] underline decoration-2 underline-offset-[25%]',
            getTextMethodColor(info.correctMethod),
          )}
        >
          {info.orgStr}
        </p>

        <h3 className='mt-[18px] text-[15px] font-semibold tracking-[-0.02em]'>
          대치어
          {candidates.length > 1 && (
            <span className='ml-[6px] text-[13px] font-medium text-slate-400 dark:text-dark-subtle'>
              {candidates.length}개
            </span>
          )}
        </h3>
        <div className='mt-2 flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-100 p-2 dark:border-dark-border dark:bg-dark-elevated'>
          {firstCandidate ? (
            <button
              type='button'
              aria-pressed={info.crtStr === firstCandidate.word}
              aria-keyshortcuts='Enter 2'
              onClick={() => corrections.choose(ref, firstCandidate.word)}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-md bg-white px-[10px] py-2 text-left shadow-sm hover:ring-1 hover:ring-inset hover:ring-blue-500 dark:bg-dark-surface dark:hover:ring-blue-300',
                info.crtStr === firstCandidate.word &&
                  'ring-1 ring-inset ring-blue-500 dark:ring-blue-300',
              )}
            >
              <span className='whitespace-pre-wrap break-all text-[16px] font-bold text-blue-500 dark:text-blue-200'>
                {firstCandidate.word}
              </span>
              <Kbd>Enter</Kbd>
            </button>
          ) : (
            <p className='px-1 py-1 text-[14px] text-slate-400 dark:text-dark-subtle'>
              제안된 대치어가 없습니다.
            </p>
          )}
          {altCandidates.length > 0 && (
            <div className='flex flex-wrap gap-[6px]'>
              {visibleAlts.map(({ id, word }) => (
                <button
                  key={id}
                  type='button'
                  title={word}
                  aria-pressed={info.crtStr === word}
                  onClick={() => corrections.choose(ref, word)}
                  className={cn(
                    'h-8 max-w-full truncate rounded-md bg-white px-[10px] text-[14px] font-semibold text-slate-600 shadow-sm hover:text-blue-500 hover:ring-1 hover:ring-inset hover:ring-blue-500 dark:bg-dark-surface dark:text-dark-text dark:hover:text-blue-200 dark:hover:ring-blue-300',
                    info.crtStr === word &&
                      'text-blue-500 ring-1 ring-inset ring-blue-500 dark:text-blue-200 dark:ring-blue-300',
                  )}
                >
                  {word}
                </button>
              ))}
              {altCandidates.length > VISIBLE_ALTS && (
                <button
                  type='button'
                  onClick={() => setShowAllAlts(prev => !prev)}
                  className='h-8 px-[6px] text-[14px] font-medium text-slate-500 underline underline-offset-[3px] hover:text-slate-600 dark:text-dark-subtle dark:hover:text-dark-text'
                >
                  {showAllAlts
                    ? '접기'
                    : `+${altCandidates.length - VISIBLE_ALTS}개 더 보기`}
                </button>
              )}
            </div>
          )}
          <form onSubmit={handleCustomSubmit} className='flex gap-[6px]'>
            <input
              ref={customInputRef}
              value={customWord}
              onChange={e => setCustomWord(e.target.value)}
              placeholder='직접 수정해 보세요 (5)'
              aria-label='대치어 직접 입력'
              aria-keyshortcuts='5'
              className='h-9 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-[10px] text-[14px] text-slate-600 placeholder:text-slate-300 focus:outline-none focus-visible:border-blue-500 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:placeholder:text-dark-subtle'
            />
            <button
              type='submit'
              disabled={!customWord.trim()}
              className={PRIMARY_BUTTON}
            >
              수정
            </button>
          </form>
        </div>

        <div className='mt-[10px] flex flex-wrap gap-[6px]'>
          {isCorrected || isIgnored ? (
            <Chip onClick={() => corrections.revert(ref)}>
              {isIgnored ? '무시 취소' : '원래대로'}
            </Chip>
          ) : (
            <Chip onClick={handleIgnore} shortcut='1'>
              무시
            </Chip>
          )}
          {showGroupActions && (
            <>
              <Chip
                onClick={handleCorrectGroup}
                disabled={!group.firstCandidate}
                active={confirmBulk}
                shortcut='4'
              >
                {confirmBulk
                  ? `정말 ${remaining}곳을 모두 바꿀까요?`
                  : `같은 오류 모두 수정 (${remaining}곳)`}
              </Chip>
              <Chip onClick={handleIgnoreGroup} shortcut='3'>
                모두 무시 ({remaining}곳)
              </Chip>
            </>
          )}
        </div>
        {confirmBulk && (
          <p className='mt-1 text-xs text-slate-500 dark:text-dark-subtle'>
            문맥상 오류는 위치마다 맞는 대치어가 다를 수 있습니다.
          </p>
        )}

        {info.help && (
          <>
            <hr className={DIVIDER} />
            <h3 className='text-[15px] font-semibold tracking-[-0.02em]'>
              도움말
            </h3>
            {/* 오류가 바뀌면 다시 그려 도움말 길이를 새로 재고 펼침을 닫는다 */}
            <HelpSection
              key={`${pageIdx}:${info.errorIdx}`}
              help={info.help}
              correctMethod={info.correctMethod}
            />
          </>
        )}

        <hr className={cn(DIVIDER, 'mb-[10px] mt-3')} />
        <button
          type='button'
          aria-expanded={isReporting}
          onClick={() => setIsReporting(prev => !prev)}
          className='-ml-1 inline-flex h-8 items-center gap-[6px] self-start rounded-md pl-1 pr-2 text-[14px] text-slate-500 hover:bg-slate-100 aria-expanded:bg-slate-100 dark:text-dark-subtle dark:hover:bg-dark-elevated dark:aria-expanded:bg-dark-elevated'
        >
          <SendIcon className='!size-[22px]' />
          오류 제보
        </button>
        {isReporting && (
          <div className='mt-2 flex flex-col gap-2'>
            <p className='break-keep text-[13px] leading-normal text-slate-500 dark:text-dark-subtle'>
              대치어가 맞지 않거나 다른 의견이 있으면 알려 주세요.
            </p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder='내용을 작성해 주세요.'
              aria-label='오류 제보 내용'
              className='min-h-[88px] resize-none rounded-md border border-slate-200 bg-slate-100 p-[10px] text-[14px] text-slate-600 placeholder:text-slate-300 focus:outline-none dark:border-dark-border dark:bg-dark-elevated dark:text-dark-text dark:placeholder:text-dark-subtle'
            />
            <button
              type='button'
              disabled={!comment}
              onClick={handleReport}
              className={cn(PRIMARY_BUTTON, 'h-[38px] text-[15px]')}
            >
              제출하기
            </button>
          </div>
        )}
      </PopoverContent>
    </PopoverPrimitive.Root>
  )
}

const DIVIDER = 'mb-[14px] mt-4 border-slate-200 dark:border-dark-border'

const PRIMARY_BUTTON =
  'h-9 shrink-0 rounded-md bg-blue-500 px-[14px] text-[14px] font-semibold text-white hover:bg-blue-500/90 disabled:bg-slate-300 dark:disabled:bg-dark-border'

// icon-circle-arrow.svg와 같은 모양. 파일은 원 배경이 흰색으로 고정이라 다크 모드에서 튀므로 색을 테마로 준다
const CircleArrowIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox='0 0 24 24'
    aria-hidden
    className={cn('size-[22px] shrink-0', className)}
  >
    <rect
      width='24'
      height='24'
      rx='12'
      className='fill-white dark:fill-dark-elevated'
    />
    <path
      d='M8.50489 11.3794C8.13295 11.6555 8.12329 12.209 8.48537 12.4979L12.9142 16.0321C13.3721 16.3974 14.0501 16.0783 14.0603 15.4926L14.1809 8.58108C14.1911 7.9954 13.5247 7.65283 13.0544 8.00199L8.50489 11.3794Z'
      className='fill-slate-400 dark:fill-dark-subtle'
    />
  </svg>
)

// 머리의 이전 · 다음 · 닫기 버튼
const IconButton = ({
  label,
  shortcut,
  disabled,
  onClick,
  className,
  children,
}: {
  label: string
  shortcut?: string
  disabled?: boolean
  onClick: () => void
  className?: string
  children: ReactNode
}) => (
  <button
    type='button'
    aria-label={label}
    title={shortcut ? `${label} (${shortcut})` : label}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-[.35] disabled:hover:bg-transparent dark:hover:bg-dark-elevated',
      className,
    )}
  >
    {children}
  </button>
)

// 무시 · 모두 수정 · 모두 무시 버튼
const Chip = ({
  onClick,
  disabled,
  active,
  shortcut,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  active?: boolean // 모두 수정 확인 단계
  shortcut?: string
  children: ReactNode
}) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    aria-keyshortcuts={shortcut}
    className={cn(
      'inline-flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-[10px] text-[13px] font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-default disabled:opacity-50 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-elevated',
      active &&
        'border-blue-500 text-blue-500 dark:border-blue-300 dark:text-blue-200',
    )}
  >
    {children}
    {shortcut && <Kbd>{shortcut}</Kbd>}
  </button>
)

export { LongErrorOverlay, METHOD_LABEL, type OverlayCommands }
