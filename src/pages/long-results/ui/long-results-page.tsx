'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClipboard } from '@frontend-opensource/use-react-hooks'
import {
  CHECK_ERROR_MESSAGE,
  errorKey,
  getCorrectedText,
  getLongProgress,
  getPageText,
  resetLongCheck,
  selectLongError,
  useSpeller,
} from '@/entities/speller'
import { useAppDispatch, useAppSelector } from '@/shared/lib/use-redux'
import { ContentLayout } from '@/shared/ui/content-layout'
import { Button } from '@/shared/ui/button'
import { toast } from '@/shared/lib/use-toast'
import {
  groupErrors,
  isProcessed,
  type ErrorGroup,
  type ErrorGroupSort,
} from '../lib/group-errors'
import {
  findAdjacentError,
  findFirstError,
  listPendingErrors,
  type ErrorPosition,
} from '../lib/error-nav'
import { useVisiblePages } from '../model/use-visible-pages'
import { useCheckQueue } from '../model/use-check-queue'
import {
  useLongCorrections,
  type ErrorRef,
} from '../model/use-long-corrections'
import { LongPageSection } from './long-page-section'
import { LongErrorPanel } from './long-error-panel'
import { LongErrorOverlay } from './long-error-overlay'
import { LongToolbar } from './long-toolbar'

// 시간 초과가 연달아 이만큼 나면 문단을 나눠 보라고 안내한다
const TIMEOUT_HINT_COUNT = 3

const LongResultsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.longCheck)
  const { originalText, pages, ignored, selected, isStrictCheck } = state
  const { handleOriginalTextChange } = useSpeller()
  const { copyText } = useClipboard()
  const containerRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLElement | null>(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [sort, setSort] = useState<ErrorGroupSort>('document')
  const [hiddenMethods, setHiddenMethods] = useState<number[]>([])
  const [bulkCounts, setBulkCounts] = useState<Record<string, number>>({})
  // 들어온 뒤 사용자가 스크롤하거나 오류를 고르기 전까지만 첫 오류를 자동으로 연다
  const autoOpenRef = useRef(true)
  // 대치어 선택 · 무시를 하면 이 위치의 다음 오류로 넘어간다 (상태가 바뀐 뒤 처리)
  const [advanceFrom, setAdvanceFrom] = useState<ErrorPosition | null>(null)
  const currentPositionRef = useRef<ErrorPosition | null>(null)

  const { viewport, isScrolling } = useVisiblePages(containerRef, pages.length)
  const queue = useCheckQueue({ viewport, isScrolling })
  const baseCorrections = useLongCorrections()

  // 모두 수정 · 모두 무시를 한 묶음은 그 뒤에 새로 나온 곳을 따로 표시한다
  const corrections = useMemo(() => {
    const advance = ({ pageIdx, info }: ErrorRef) =>
      setAdvanceFrom({ pageIdx, start: info.start })
    const advanceFromCurrent = () => setAdvanceFrom(currentPositionRef.current)

    return {
      ...baseCorrections,
      choose: (ref: ErrorRef, word: string) => {
        baseCorrections.choose(ref, word)
        advance(ref)
      },
      replaceByUser: (ref: ErrorRef, word: string) => {
        baseCorrections.replaceByUser(ref, word)
        advance(ref)
      },
      ignore: (refs: ErrorRef[]) => {
        baseCorrections.ignore(refs)
        if (refs.length === 1) advance(refs[0])
      },
      correctGroup: (group: ErrorGroup) => {
        setBulkCounts(prev => ({ ...prev, [group.key]: group.items.length }))
        const count = baseCorrections.correctGroup(group)
        advanceFromCurrent()
        return count
      },
      ignoreGroup: (group: ErrorGroup) => {
        setBulkCounts(prev => ({ ...prev, [group.key]: group.items.length }))
        const count = baseCorrections.ignoreGroup(group)
        advanceFromCurrent()
        return count
      },
    }
  }, [baseCorrections])

  // 입력 화면을 거치지 않고 들어온 경우
  useEffect(() => {
    if (!originalText) router.replace('/invalid-access')
  }, [originalText, router])

  const progress = getLongProgress(state)
  const groups = useMemo(
    () => groupErrors({ pages, ignored }, sort),
    [pages, ignored, sort],
  )
  const remainingErrors = useMemo(
    () => groups.reduce((count, group) => count + group.remaining, 0),
    [groups],
  )

  const selectedKey = selected
    ? errorKey(selected.pageIdx, selected.errorIdx)
    : null
  const selectedGroup = useMemo(
    () =>
      selectedKey
        ? (groups.find(g => g.items.some(item => item.key === selectedKey)) ??
          null)
        : null,
    [groups, selectedKey],
  )
  const selectedInfo = selected
    ? pages[selected.pageIdx]?.errInfo.find(
        e => e.errorIdx === selected.errorIdx,
      )
    : undefined

  const findErrorElement = (pageIdx: number, errorIdx: number) =>
    containerRef.current?.querySelector<HTMLElement>(
      `[data-page-idx="${pageIdx}"] [data-error-idx="${errorIdx}"]`,
    ) ?? null

  const openError = useCallback(
    (pageIdx: number, errorIdx: number) => {
      autoOpenRef.current = false
      anchorRef.current = findErrorElement(pageIdx, errorIdx)
      dispatch(selectLongError({ pageIdx, errorIdx }))
      setIsOverlayOpen(true)
    },
    [dispatch],
  )

  // 오류어가 문서 화면 밖에 있으면 가운데로 옮긴 뒤 정보창을 연다.
  // scrollIntoView는 창 전체까지 움직이므로 문서 영역만 스크롤한다
  const revealError = useCallback(
    (pageIdx: number, errorIdx: number) => {
      const container = containerRef.current
      const el = findErrorElement(pageIdx, errorIdx)
      if (container && el) {
        const box = container.getBoundingClientRect()
        const rect = el.getBoundingClientRect()
        if (rect.top < box.top || rect.bottom > box.bottom) {
          container.scrollTo({
            top:
              container.scrollTop +
              rect.top -
              box.top -
              (container.clientHeight - rect.height) / 2,
          })
        }
      }
      openError(pageIdx, errorIdx)
    },
    [openError],
  )

  // 묶음을 누르면 아직 처리하지 않은 첫 위치로 문서를 옮기고 정보창을 연다
  const handleSelectGroup = useCallback(
    (group: ErrorGroup) => {
      const target =
        group.items.find(item => !isProcessed({ ignored }, item)) ??
        group.items[0]
      if (!target) return
      revealError(target.pageIdx, target.info.errorIdx)
    },
    [ignored, revealError],
  )

  // 이전 · 다음 오류는 아직 처리하지 않았고 목록에서 숨기지 않은 오류만 오간다
  const pendingErrors = useMemo(
    () => listPendingErrors({ pages, ignored }, hiddenMethods),
    [pages, ignored, hiddenMethods],
  )
  const currentPosition =
    selected && selectedInfo
      ? { pageIdx: selected.pageIdx, start: selectedInfo.start }
      : null
  const prevError = currentPosition
    ? findAdjacentError(pendingErrors, currentPosition, -1)
    : null
  const nextError = currentPosition
    ? findAdjacentError(pendingErrors, currentPosition, 1)
    : null
  const currentIndex = pendingErrors.findIndex(item => item.key === selectedKey)
  currentPositionRef.current = currentPosition

  // 처리한 오류 다음으로 넘어간다. 뒤에 남은 오류가 없으면 지금 정보창을 그대로 둔다
  useEffect(() => {
    if (!advanceFrom) return
    setAdvanceFrom(null)
    const next = findAdjacentError(pendingErrors, advanceFrom, 1)
    if (next) revealError(next.pageIdx, next.info.errorIdx)
  }, [advanceFrom, pendingErrors, revealError])

  // 첫 오류: 앞 구간 검사가 끝나 첫 오류가 정해지면 한 번만 연다
  useEffect(() => {
    if (isScrolling) autoOpenRef.current = false
  }, [isScrolling])
  useEffect(() => {
    if (!autoOpenRef.current) return
    const first = findFirstError({ pages, ignored }, hiddenMethods)
    if (first === undefined) return
    autoOpenRef.current = false
    if (first) revealError(first.pageIdx, first.info.errorIdx)
  }, [pages, ignored, hiddenMethods, revealError])

  const handleToggleMethod = useCallback((method: number) => {
    setHiddenMethods(prev =>
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method],
    )
  }, [])

  const { retry } = queue
  const handleRetry = useCallback((pageIdx: number) => retry(pageIdx), [retry])

  const handleCopyAll = () => {
    copyText(getCorrectedText(state))
    toast({
      description:
        progress.done < progress.total
          ? '복사 완료!\n검사하지 않은 부분은 원문 그대로 들어갔습니다.'
          : '복사 완료!\n원하는 곳에 붙여넣어 보세요.',
    })
  }

  const handleNewText = () => {
    handleOriginalTextChange('')
    dispatch(resetLongCheck())
    router.push('/speller')
  }

  if (!originalText) return null

  const canRequestAll =
    !queue.allRequested &&
    pages.some(page => page.status === 'idle' || page.status === 'queued')

  return (
    <ContentLayout className='min-h-0 grid-rows-[auto_minmax(0,1fr)] pb-4 pc:pb-5'>
      <LongToolbar
        progress={progress}
        remainingErrors={remainingErrors}
        isStrictCheck={isStrictCheck}
        canRequestAll={canRequestAll}
        onRequestAll={queue.requestAll}
        onScrollTop={() => containerRef.current?.scrollTo({ top: 0 })}
        onCopyAll={handleCopyAll}
        onNewText={handleNewText}
        onBack={() => router.push('/speller')}
      />
      <div className='flex min-h-0 gap-3'>
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
          {queue.paused && (
            <div
              role='alert'
              className='flex items-center justify-between gap-3 rounded-lg bg-yellow-400/20 px-4 py-3 text-base'
            >
              <span className='whitespace-pre-line'>
                {CHECK_ERROR_MESSAGE.rate}
              </span>
              <Button variant='outline' onClick={queue.resume}>
                다시 시작
              </Button>
            </div>
          )}
          {queue.consecutiveTimeouts >= TIMEOUT_HINT_COUNT && (
            <div
              role='status'
              className='rounded-lg bg-slate-200 px-4 py-3 text-base dark:bg-dark-elevated'
            >
              서버 응답이 계속 늦습니다. 줄바꿈을 넣어 문단을 나누면 검사가 잘
              될 수 있습니다.
            </div>
          )}
          <div
            ref={containerRef}
            className='min-h-0 flex-1 overflow-y-auto rounded-[1rem] bg-white p-6 dark:bg-dark-surface'
          >
            {pages.map((page, pageIdx) => (
              <LongPageSection
                key={`${page.start}:${page.end}`}
                pageIdx={pageIdx}
                page={page}
                text={getPageText(state, pageIdx)}
                ignored={ignored}
                selectedErrorIdx={
                  selected?.pageIdx === pageIdx ? selected.errorIdx : null
                }
                onSelectError={openError}
                onRetry={handleRetry}
              />
            ))}
          </div>
        </div>
        <LongErrorPanel
          groups={groups}
          sort={sort}
          onSortChange={setSort}
          hiddenMethods={hiddenMethods}
          onToggleMethod={handleToggleMethod}
          selectedGroupKey={selectedGroup?.key ?? null}
          onSelectGroup={handleSelectGroup}
          progress={progress}
          bulkCounts={bulkCounts}
        />
      </div>
      {selected && selectedInfo && (
        <LongErrorOverlay
          anchorRef={anchorRef}
          open={isOverlayOpen}
          onOpenChange={setIsOverlayOpen}
          pageIdx={selected.pageIdx}
          info={selectedInfo}
          pageText={getPageText(state, selected.pageIdx)}
          isIgnored={!!selectedKey && !!ignored[selectedKey]}
          group={selectedGroup}
          corrections={corrections}
          onPrev={
            prevError
              ? () => revealError(prevError.pageIdx, prevError.info.errorIdx)
              : null
          }
          onNext={
            nextError
              ? () => revealError(nextError.pageIdx, nextError.info.errorIdx)
              : null
          }
          position={
            currentIndex >= 0
              ? { index: currentIndex, total: pendingErrors.length }
              : null
          }
        />
      )}
    </ContentLayout>
  )
}

export { LongResultsPage }
