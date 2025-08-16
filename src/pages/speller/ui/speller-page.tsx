'use client'

import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { useKeyCombination } from '@frontend-opensource/use-react-hooks'
import { useSpeller, SpellerSetting, CheckPayload } from '@/entities/speller'
import { ContentLayout } from '@/shared/ui/content-layout'
import {
  sendCheckCompletedEvent,
  sendCheckResultNoErrorEvent,
  sendCheckResultResponseErrorEvent,
  sendCheckResultResponseUnknownEvent,
} from '@/shared/lib/send-ga-event'
import { spellCheckAction } from '../api/spell-check-action'
import { TIMEOUT_ERROR_CODE } from '../model/error-code'
import { spellCheckSchema } from '../model/spell-check-schema'
import { SpellerTextInput } from './speller-text-input'
import { ResultsSkeleton } from './results-skeleton'
import { SpellerControl } from './speller-control'
import { VersionInfo } from './version-info'

export type SpellCheckResponse = z.infer<typeof spellCheckSchema>
import { NoticeDialog } from './notice-dialog'

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
  const [serverState, setServerState] = useState<SpellCheckResponse>({
    data: null,
    error: null,
    elapsedTimeMs: 0,
  })
  const [isRedirectingToResult, setIsRedirectingToResult] = useState(false)

  const handleSpellCheck = () => {
    const payload: CheckPayload = {
      text: originalText,
      isStrictCheck,
    }
    startTransition(async () => {
      const response = await spellCheckAction(payload)
      setServerState(response)
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
    if (serverState.data) {
      const { data, elapsedTimeMs } = serverState
      const payload = {
        textLength: data.str.length,
        isStrictCheck: data.requestedWithStrictMode,
        elapsedTimeMs: elapsedTimeMs,
      }

      setIsRedirectingToResult(true)
      updateResponse(data)
      initResponseMap()
      initDisplayTextMap()
      updateResponseMap({
        ...data,
        requestedWithStrictMode: payload.isStrictCheck,
        pageIdx: 1,
      })
      sendCheckCompletedEvent(payload)
      if (data.errInfo.length === 0) {
        sendCheckResultNoErrorEvent(payload)
      }

      return router.push('/results')
    }

    if (serverState.error) {
      setIsRedirectingToResult(false)
      if (serverState.error.type === 'server') {
        const {
          error: {
            errorCode,
            errorMessage,
            requestPayload: { isStrictCheck, textLength },
          },
          elapsedTimeMs,
        } = serverState
        const errorStage =
          errorCode === TIMEOUT_ERROR_CODE ? 'timeout' : 'request'

        sendCheckResultResponseErrorEvent({
          errorStage,
          errorCode,
          errorMessage,
          isStrictCheck,
          textLength,
          elapsedTimeMs,
        })

        if (errorCode === TIMEOUT_ERROR_CODE) {
          return router.push('/timeout')
        } else {
          throw new Error(errorMessage)
        }
      } else {
        sendCheckResultResponseUnknownEvent({
          errorStage: 'unknown',
          errorCode: 9999,
          errorMessage: serverState.error.errorMessage,
          elapsedTimeMs: serverState.elapsedTimeMs,
        })
        throw new Error(serverState.error.errorMessage)
      }
    }
  }, [serverState])

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
          {/* 강한 검사 및 버전*/}
          <div className='mb-2 mt-[0.94rem] flex min-h-[1.625rem] items-center justify-between tab:mt-[1.75rem] pc:mb-[0.78rem] pc:mt-[1.97rem] pc:min-h-8'>
            <VersionInfo />
            <SpellerSetting />
          </div>
          <div className='flex h-full w-full flex-col rounded-lg bg-white p-4 tab:rounded-[1rem] tab:p-5 pc:p-6'>
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
