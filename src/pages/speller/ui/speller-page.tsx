'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useSpeller, SpellerSetting } from '@/entities/speller'
import { ContentLayout } from '@/shared/ui/content-layout'
import { spellCheckAction } from '../api/spell-check-action'
import { TIMEOUT_ERROR_CODE } from '../model/error-code'
import { SpellerTextInput } from './speller-text-input'
import { ResultsSkeleton } from './results-skeleton'
import { SpellerControl } from './speller-control'
import { ServiceUpdateInfoDialog } from './service-update-info-dialog'
import {
  sendCheckCompletedEvent,
  sendCheckResultNoErrorEvent,
  sendCheckResultResponseErrorEvent,
  sendCheckResultResponseUnknownEvent,
} from '@/shared/lib/send-ga-event'

const SpellerPage = () => {
  const router = useRouter()
  const { handleReceiveResponse, initResponseMap } = useSpeller()
  const [state, formAction, isPending] = useActionState(spellCheckAction, {
    data: null,
    error: null,
    elapsedTimeMs: 0,
  })
  const [isRedirectingToResult, setIsRedirectingToResult] = useState(false)

  useEffect(() => {
    if (state.data) {
      const { data, elapsedTimeMs } = state
      const payload: Parameters<typeof sendCheckCompletedEvent>[0] = {
        textLength: data.str.length,
        isStrictCheck: data.requestedWithStrictMode,
        elapsedTimeMs: elapsedTimeMs,
      }

      setIsRedirectingToResult(true)
      handleReceiveResponse(data)
      initResponseMap()
      sendCheckCompletedEvent(payload)

      if (data.errInfo.length === 0) {
        sendCheckResultNoErrorEvent(payload)

        return router.push(`/no-errors`)
      }

      return router.push('/results')
    }

    if (state.error) {
      setIsRedirectingToResult(false)

      if (state.error.type === 'server') {
        const {
          error: {
            errorCode,
            errorMessage,
            requestPayload: { isStrictCheck, textLength },
          },
          elapsedTimeMs,
        } = state
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
      } else {
        sendCheckResultResponseUnknownEvent({
          errorStage: 'unknown',
          errorCode: 9999,
          errorMessage: state.error.errorMessage,
          elapsedTimeMs: state.elapsedTimeMs,
        })
      }

      return router.push(`/timeout`)
    }
  }, [state, router, handleReceiveResponse])

  useEffect(() => {
    router.prefetch('/results')
  }, [router])

  if (isPending || isRedirectingToResult) {
    return <ResultsSkeleton />
  }

  return (
    <>
      <form action={formAction} className='flex-1'>
        <ContentLayout className='min-h-[35.75rem] pb-9 pc:pb-[3.125rem]'>
          {/* 강한 검사 */}
          <div className='mb-2 mt-[0.94rem] min-h-[1.625rem] tab:mt-[1.75rem] pc:mb-[0.78rem] pc:mt-[1.97rem] pc:min-h-8'>
            <SpellerSetting />
          </div>
          <div className='flex h-full w-full flex-col rounded-lg bg-white p-5 tab:rounded-[1rem] tab:p-10'>
            <SpellerTextInput />
            {/* 글자수 & 검사하기 버튼 */}
            <SpellerControl />
          </div>
        </ContentLayout>
      </form>
      <ServiceUpdateInfoDialog />
    </>
  )
}

export { SpellerPage }
