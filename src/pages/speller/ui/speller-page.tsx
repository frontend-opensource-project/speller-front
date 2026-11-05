'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useKeyCombination } from '@frontend-opensource/use-react-hooks'
import {
  useSpeller,
  SpellerSetting,
  CheckPayload,
  checkText,
  CHECK_ERROR_MESSAGE,
  splitPages,
  findLongParagraphs,
  startLongCheck,
  type CheckTextResult,
} from '@/entities/speller'
import { ContentLayout } from '@/shared/ui/content-layout'
import { LONG_MODE_ENABLED, NORMAL_CHECK_QUERY } from '@/shared/config'
import { useAppDispatch } from '@/shared/lib/use-redux'
import { useBreakpoint } from '@/shared/lib/use-break-point'
import { getBreakpoint } from '@/shared/lib/get-break-point'
import {
  sendCheckCompletedEvent,
  sendCheckResultNoErrorEvent,
  sendCheckResultResponseErrorEvent,
  sendCheckResultResponseUnknownEvent,
} from '@/shared/lib/send-ga-event'
import { toast } from '@/shared/lib/use-toast'
import {
  SpellerTextInput,
  type SpellerTextInputHandle,
} from './speller-text-input'
import { LongParagraphDialog } from './long-paragraph-dialog'
import { ResultsSkeleton } from './results-skeleton'
import { SpellerControl } from './speller-control'
import { VersionInfo } from './version-info'
import { NoticeDialog } from './notice-dialog'
import { useLongModePreference } from '../model/use-long-mode-preference'

// 긴글 모드는 PC 전용 (1024px 이상)
const isDesktop = (breakpoint: ReturnType<typeof getBreakpoint>) =>
  breakpoint === 'desktop' || breakpoint === 'desktop-large'

interface CheckState {
  result: CheckTextResult
  isStrictCheck: boolean
  textLength: number
}

const SpellerPage = () => {
  const router = useRouter()
  const {
    originalText,
    isStrictCheck,
    updateResponse,
    updateResponseMap,
    initResponseMap,
    initDisplayTextMap,
  } = useSpeller()
  const [isPending, startTransition] = useTransition()
  const [checkState, setCheckState] = useState<CheckState | null>(null)
  const [isRedirectingToResult, setIsRedirectingToResult] = useState(false)
  const dispatch = useAppDispatch()
  const textInputRef = useRef<SpellerTextInputHandle>(null)
  // 너무 긴 문단이 있으면 검사 전에 경고를 띄운다.
  // 문단 확인은 창이 닫힌 뒤에 커서를 옮기므로 그 문단의 시작 위치를 따로 둔다
  const [isLongParagraphOpen, setIsLongParagraphOpen] = useState(false)
  const longParagraphStartRef = useRef(0)
  const breakpoint = useBreakpoint()
  const [longModeEnabled, setLongModeEnabled] = useLongModePreference()
  const canUseLongMode = LONG_MODE_ENABLED && isDesktop(breakpoint)
  // 원문은 저장할 때 줄바꿈을 정규화하므로 요청과 같은 기준으로 나뉜다
  const pageCount = useMemo(
    () => (canUseLongMode ? splitPages(originalText).length : 0),
    [canUseLongMode, originalText],
  )

  const runNormalCheck = () => {
    const payload: CheckPayload = {
      text: originalText,
      isStrictCheck,
    }
    startTransition(async () => {
      const result = await checkText(payload)
      setCheckState({
        result,
        isStrictCheck: payload.isStrictCheck ?? false,
        textLength: payload.text.length,
      })
    })
  }

  const startSpellCheck = () => {
    // 긴글 모드: 요청 전에 결과 화면으로 이동하고, 구간 검사는 그 화면에서 한다
    if (
      LONG_MODE_ENABLED &&
      longModeEnabled &&
      isDesktop(getBreakpoint()) &&
      splitPages(originalText).length >= 2
    ) {
      setIsRedirectingToResult(true)
      dispatch(
        startLongCheck({
          text: originalText,
          isStrictCheck,
          startedAt: Date.now(),
        }),
      )
      router.push('/results/long')
      return
    }
    runNormalCheck()
  }

  const handleSpellCheck = () => {
    if (isLongParagraphOpen) return
    const [longParagraph] = findLongParagraphs(originalText)
    if (longParagraph) {
      longParagraphStartRef.current = longParagraph.start
      setIsLongParagraphOpen(true)
      return
    }
    startSpellCheck()
  }

  const handleLongParagraphContinue = () => {
    setIsLongParagraphOpen(false)
    startSpellCheck()
  }

  const handleLongParagraphLocate = () =>
    textInputRef.current?.focusAt(longParagraphStartRef.current)

  // 긴글 화면에서 '일반 모드에서 검사'로 넘어온 경우: 긴글 모드를 건너뛰고 한 번 검사한다.
  // 개발 모드에서 effect가 두 번 돌아도 요청은 한 번만 보낸다
  const normalCheckRequestedRef = useRef(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has(NORMAL_CHECK_QUERY)) return
    router.replace('/speller')
    if (normalCheckRequestedRef.current || !originalText) return
    normalCheckRequestedRef.current = true
    runNormalCheck()
    // 들어올 때 한 번만 본다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 검사하기 단축키 설정
  useKeyCombination({
    shortcutKeys: ['ControlLeft', 'Enter'],
    callback: handleSpellCheck,
  })
  useKeyCombination({
    shortcutKeys: ['ControlRight', 'Enter'],
    callback: handleSpellCheck,
  })
  useKeyCombination({
    shortcutKeys: ['MetaLeft', 'Enter'],
    callback: handleSpellCheck,
  })
  useKeyCombination({
    shortcutKeys: ['MetaRight', 'Enter'],
    callback: handleSpellCheck,
  })

  useEffect(() => {
    if (!checkState) return
    const { result, isStrictCheck, textLength } = checkState

    if (result.data) {
      const { data, elapsedTimeMs } = result
      const payload = {
        textLength: data.str.length,
        isStrictCheck,
        elapsedTimeMs,
      }
      const response = { ...data, requestedWithStrictMode: isStrictCheck }

      setIsRedirectingToResult(true)
      updateResponse(response)
      initResponseMap()
      initDisplayTextMap()
      updateResponseMap({ ...response, pageIdx: 1 })
      sendCheckCompletedEvent(payload)
      if (data.errInfo.length === 0) {
        sendCheckResultNoErrorEvent(payload)
      }

      return router.push('/results')
    }

    const { error, elapsedTimeMs } = result
    const errorMessage = error.errorMessage.slice(0, 100)

    if (error.kind === 'schema') {
      sendCheckResultResponseUnknownEvent({
        errorStage: 'unknown',
        errorCode: error.httpStatus ?? 9999,
        errorMessage,
        elapsedTimeMs,
      })
    } else {
      sendCheckResultResponseErrorEvent({
        errorStage: error.kind === 'timeout' ? 'timeout' : 'request',
        errorCode: error.errorCode ?? error.httpStatus ?? 9999,
        errorMessage,
        isStrictCheck,
        textLength,
        elapsedTimeMs,
      })
    }

    if (error.kind === 'timeout') return router.push('/timeout')
    if (error.kind === 'rate') return router.push('/rate-limit')

    // 그 밖의 오류는 입력한 글을 그대로 두고 안내만 한다
    toast({ description: CHECK_ERROR_MESSAGE[error.kind] })
  }, [checkState])

  useEffect(() => {
    router.prefetch('/results')
    if (LONG_MODE_ENABLED) router.prefetch('/results/long')
  }, [router])

  if (isPending || isRedirectingToResult) {
    return <ResultsSkeleton />
  }

  return (
    <>
      <form action={handleSpellCheck} className='flex-1'>
        <ContentLayout className='min-h-[35.75rem] pb-4 pc:pb-5'>
          {/* 화면에는 로고가 제목 역할을 하므로, 문서 구조상의 제목만 따로 둔다 */}
          <h1 className='sr-only'>바른한글 - 한국어 맞춤법·문법 검사기</h1>
          {/* 강한 검사 및 버전*/}
          <div className='mb-2 mt-[0.94rem] flex min-h-[1.625rem] items-center justify-between tab:mt-[1.75rem] pc:mb-[0.78rem] pc:mt-[1.97rem] pc:min-h-8'>
            <VersionInfo />
            <SpellerSetting />
          </div>
          <div className='flex h-full w-full flex-col rounded-lg bg-white p-4 dark:bg-dark-surface tab:rounded-[1rem] tab:p-5 pc:p-6'>
            <SpellerTextInput ref={textInputRef} />
            {/* 글자수 & 검사하기 버튼 */}
            <SpellerControl
              longMode={
                canUseLongMode
                  ? {
                      enabled: longModeEnabled,
                      onChange: setLongModeEnabled,
                      pageCount,
                    }
                  : undefined
              }
            />
          </div>
        </ContentLayout>
      </form>
      <NoticeDialog />
      <LongParagraphDialog
        open={isLongParagraphOpen}
        onContinue={handleLongParagraphContinue}
        onLocate={handleLongParagraphLocate}
        onCancel={() => setIsLongParagraphOpen(false)}
      />
    </>
  )
}

export { SpellerPage }
