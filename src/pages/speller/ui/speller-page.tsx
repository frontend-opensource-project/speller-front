'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { useKeyCombination } from '@frontend-opensource/use-react-hooks'
import {
  useSpeller,
  SpellerSetting,
  CheckPayload,
  checkText,
  CHECK_ERROR_MESSAGE,
  type CheckTextResult,
} from '@/entities/speller'
import { ContentLayout } from '@/shared/ui/content-layout'
import {
  sendCheckCompletedEvent,
  sendCheckResultNoErrorEvent,
  sendCheckResultResponseErrorEvent,
  sendCheckResultResponseUnknownEvent,
} from '@/shared/lib/send-ga-event'
import { toast } from '@/shared/lib/use-toast'
import { SpellerTextInput } from './speller-text-input'
import { ResultsSkeleton } from './results-skeleton'
import { SpellerControl } from './speller-control'
import { VersionInfo } from './version-info'
import { NoticeDialog } from './notice-dialog'

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

  const handleSpellCheck = () => {
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
            <SpellerTextInput />
            {/* 글자수 & 검사하기 버튼 */}
            <SpellerControl />
          </div>
        </ContentLayout>
      </form>
      <NoticeDialog />
    </>
  )
}

export { SpellerPage }
