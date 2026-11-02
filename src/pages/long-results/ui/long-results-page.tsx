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
  undoLongCheck,
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
  findUncheckedPageAfter,
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
import { useLongModeHotkeys } from '../model/use-long-mode-hotkeys'
import {
  LongErrorOverlay,
  METHOD_LABEL,
  type OverlayCommands,
} from './long-error-overlay'
import { LongToolbar } from './long-toolbar'
import { LongHotkeyHelp } from './long-hotkey-help'
import { LongCheckIntro } from './long-check-intro'
import { LongInterstitial } from './long-interstitial'
import { LONG_INTRO_NOTICE } from '../config/intro-notice'

// 시간 초과가 연달아 이만큼 나면 문단을 나눠 보라고 안내한다
const TIMEOUT_HINT_COUNT = 3

// 첫 진입 때 단축키 안내를 한 번만 보여 준다
const HOTKEY_HINT_KEY = 'longModeHotkeyHint'

// 진입 안내창 · 전면 광고를 띄운 검사. 새로고침 · 뒤로 가기로 같은 검사에 돌아오면 다시 띄우지 않는다
const INTRO_SHOWN_KEY = 'longModeIntroCheckId'

const shouldShowIntro = (checkId: number) => {
  try {
    return sessionStorage.getItem(INTRO_SHOWN_KEY) !== String(checkId)
  } catch {
    return true
  }
}

const LongResultsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.longCheck)
  const {
    checkId,
    originalText,
    pages,
    ignored,
    selected,
    isStrictCheck,
    undoStack,
  } = state
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
  // 이 위치의 다음 오류로 넘어간다 (상태가 바뀐 뒤 처리).
  // 검사한 곳에 다음 오류가 없으면 다음 구간을 검사해 가며 기다린다
  const [advanceFrom, setAdvanceFrom] = useState<ErrorPosition | null>(null)
  const currentPositionRef = useRef<ErrorPosition | null>(null)
  const overlayCommandsRef = useRef<OverlayCommands | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  // 이 화면은 PersistGate 안에서 브라우저에서만 그려지므로 처음 값을 바로 정한다.
  // 광고는 한 번 정하면 바꾸지 않는다 (바꾸면 광고 컨테이너가 지워짐)
  const [showIntroAd] = useState(
    () => !!originalText && shouldShowIntro(checkId),
  )
  const [isIntroOpen, setIsIntroOpen] = useState(showIntroAd)

  useEffect(() => {
    if (!showIntroAd) return
    try {
      sessionStorage.setItem(INTRO_SHOWN_KEY, String(checkId))
    } catch {
      // 저장하지 못하면 다음에 또 보일 뿐이다
    }
  }, [showIntroAd, checkId])

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
      setAdvanceFrom(null)
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
      // 포커스가 묶음 버튼에 남으면 Enter가 그 버튼을 다시 눌러 단축키로 쓰이지 않는다
      containerRef.current?.focus({ preventScroll: true })
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

  const { prioritize } = queue
  const hasUncheckedAfter = (pageIdx: number) =>
    findUncheckedPageAfter(pages, pageIdx) >= 0

  // 다음 오류로 넘어간다. 검사한 곳에 없으면 뒤 구간을 하나씩 먼저 검사해 가며 기다리고,
  // 끝까지 검사해도 없으면 지금 정보창을 그대로 둔다
  useEffect(() => {
    if (!advanceFrom) return
    const next = findAdjacentError(pendingErrors, advanceFrom, 1)
    if (next) {
      revealError(next.pageIdx, next.info.errorIdx)
      return
    }
    const unchecked = findUncheckedPageAfter(pages, advanceFrom.pageIdx)
    if (unchecked < 0) setAdvanceFrom(null)
    else prioritize(unchecked)
  }, [advanceFrom, pendingErrors, pages, revealError, prioritize])

  // 선택한 오류가 없으면 문서 맨 앞에서 찾는다
  const goNext = () => {
    const from = currentPositionRef.current ?? { pageIdx: -1, start: -1 }
    if (!findAdjacentError(pendingErrors, from, 1)) {
      if (!hasUncheckedAfter(from.pageIdx)) {
        toast({ description: '마지막 오류입니다.' })
        return
      }
      toast({ description: '다음 구간을 검사하고 있습니다.' })
    }
    setAdvanceFrom(from)
  }

  const goPrev = () => {
    const target = currentPositionRef.current
      ? findAdjacentError(pendingErrors, currentPositionRef.current, -1)
      : pendingErrors[pendingErrors.length - 1]
    if (target) revealError(target.pageIdx, target.info.errorIdx)
  }

  const handleOverlayOpenChange = useCallback((open: boolean) => {
    setIsOverlayOpen(open)
    if (!open) setAdvanceFrom(null)
  }, [])

  // 화면 상태만 되돌린다. 이미 보낸 /notChange는 취소하지 않는다
  const handleUndo = () => {
    const entry = undoStack[undoStack.length - 1]
    if (!entry) return
    dispatch(undoLongCheck())
    toast({
      description:
        entry.keys.length > 1
          ? `${entry.keys.length}곳을 되돌렸습니다.`
          : '되돌렸습니다.',
    })
    const [pageIdx, errorIdx] = entry.keys[0].split(':').map(Number)
    revealError(pageIdx, errorIdx)
  }

  // 오류를 고르면 스크린리더에 위치와 대치어를 알린다
  useEffect(() => {
    if (!selectedInfo) return
    const candidate = selectedGroup?.firstCandidate
    setAnnouncement(
      [
        currentIndex >= 0 && `오류 ${currentIndex + 1}/${pendingErrors.length}`,
        METHOD_LABEL[selectedInfo.correctMethod],
        selectedInfo.orgStr,
        candidate && `대치어 ${candidate}`,
      ]
        .filter(Boolean)
        .join(', '),
    )
    // 선택이 바뀔 때만 알린다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey])

  // 진입 안내창이 닫힌 뒤에 보여 준다
  useEffect(() => {
    if (isIntroOpen) return
    try {
      if (localStorage.getItem(HOTKEY_HINT_KEY)) return
      localStorage.setItem(HOTKEY_HINT_KEY, 'seen')
    } catch {
      return
    }
    toast({
      description:
        '키보드로도 교정할 수 있습니다.\n? 키를 눌러 단축키를 확인해 보세요.',
    })
  }, [isIntroOpen])

  // 첫 오류: 앞 구간 검사가 끝나 첫 오류가 정해지면 한 번만 연다
  useEffect(() => {
    if (isScrolling) autoOpenRef.current = false
  }, [isScrolling])
  // 진입 안내창이 열려 있으면 닫힌 뒤에 연다
  useEffect(() => {
    if (!autoOpenRef.current || isIntroOpen) return
    const first = findFirstError({ pages, ignored }, hiddenMethods)
    if (first === undefined) return
    autoOpenRef.current = false
    if (first) revealError(first.pageIdx, first.info.errorIdx)
  }, [pages, ignored, hiddenMethods, revealError, isIntroOpen])

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
    if (!originalText) return
    copyText(getCorrectedText(state))
    toast({
      description:
        progress.done < progress.total
          ? '복사 완료!\n검사하지 않은 부분은 원문 그대로 들어갔습니다.'
          : '복사 완료!\n원하는 곳에 붙여넣어 보세요.',
    })
  }

  // 정보창이 닫혀 있어도 선택한 오류에 동작한다. 선택한 오류가 없으면 첫 오류를 고른다
  const runOnSelected = (command: keyof OverlayCommands) => {
    if (!selected || !selectedInfo) {
      goNext()
      return
    }
    setIsOverlayOpen(true)
    if (command === 'focusCustom') {
      // 정보창이 닫혀 있었다면 그려진 뒤에 입력 칸이 생긴다
      setTimeout(() => overlayCommandsRef.current?.focusCustom())
    } else {
      overlayCommandsRef.current?.[command]()
    }
  }

  useLongModeHotkeys(
    {
      next: goNext,
      prev: goPrev,
      correctFirst: () => runOnSelected('correctFirst'),
      ignore: () => runOnSelected('ignore'),
      ignoreGroup: () => runOnSelected('ignoreGroup'),
      correctGroup: () => runOnSelected('correctGroup'),
      editCustom: () => runOnSelected('focusCustom'),
      // 정보창이 열려 있으면 Radix가 Esc로 닫으므로 여기에는 닫힌 뒤에만 온다
      escape: () => {
        if (selected) dispatch(selectLongError(null))
      },
      undo: handleUndo,
      copyAll: handleCopyAll,
      help: () => setIsHelpOpen(true),
    },
    !!originalText && !isHelpOpen && !isIntroOpen,
  )

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
        canUndo={undoStack.length > 0}
        onUndo={handleUndo}
        onHelp={() => setIsHelpOpen(true)}
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
          {/* 광고 iframe으로 포커스가 넘어갔어도 문서를 누르면 단축키가 다시 동작하도록 포커스를 받는다 */}
          <div
            ref={containerRef}
            tabIndex={-1}
            aria-label='교정 문서'
            className='min-h-0 flex-1 overflow-y-auto rounded-[1rem] bg-white p-6 outline-none dark:bg-dark-surface'
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
          onOpenChange={handleOverlayOpenChange}
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
            nextError || (selected && hasUncheckedAfter(selected.pageIdx))
              ? goNext
              : null
          }
          position={
            currentIndex >= 0
              ? { index: currentIndex, total: pendingErrors.length }
              : null
          }
          commandsRef={overlayCommandsRef}
        />
      )}
      <LongHotkeyHelp open={isHelpOpen} onOpenChange={setIsHelpOpen} />
      <LongCheckIntro
        open={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
        progress={progress}
        notice={LONG_INTRO_NOTICE}
      />
      {showIntroAd && <LongInterstitial />}
      <div aria-live='polite' className='sr-only'>
        {announcement}
      </div>
    </ContentLayout>
  )
}

export { LongResultsPage }
