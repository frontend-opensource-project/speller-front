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

const SpellerPage = () => {
  const router = useRouter()
  const { handleReceiveResponse, initResponseMap } = useSpeller()
  const [state, formAction, isPending] = useActionState(spellCheckAction, {
    data: null,
    error: null,
  })
  const [isRedirectingToResult, setIsRedirectingToResult] = useState(false)

  useEffect(() => {
    if (state.data) {
      setIsRedirectingToResult(true)
      handleReceiveResponse(state.data)
      initResponseMap()

      if (state.data.errInfo.length === 0) {
        router.push(
          `/no-errors?isStrictCheck=${state.data.requestedWithStrictMode}`,
        )
        return
      }
      router.push('/results')
    }

    // TODO: Error Boundary 적용
    if (state.error) {
      console.error(state.error)
      setIsRedirectingToResult(false)
      if (
        (state.error as { errorCode?: number })?.errorCode ===
        TIMEOUT_ERROR_CODE
      ) {
        router.push(
          `/timeout?isStrictCheck=${state?.data?.requestedWithStrictMode}`,
        )
      }
    }
  }, [state, router, handleReceiveResponse])

  useEffect(() => {
    router.prefetch('/results')
  }, [router])

  if (isPending || isRedirectingToResult) {
    return <ResultsSkeleton />
  }

  return (
    <form action={formAction} className='flex-1'>
      <ContentLayout className='pb-9 tab:pb-40 pc:pb-[3.06rem]'>
        {/* 강한 검사 */}
        <div className='mb-2 mt-[0.94rem] min-h-[1.625rem] tab:mt-[1.75rem] pc:mb-[0.78rem] pc:mt-[1.97rem] pc:min-h-8'>
          <SpellerSetting />
        </div>
        <div className='flex h-full w-full flex-col rounded-lg bg-white p-5 tab:rounded-[1rem] tab:p-10 pc:max-h-[40.25rem]'>
          <SpellerTextInput />
          {/* 글자수 & 검사하기 버튼 */}
          <SpellerControl />
        </div>
      </ContentLayout>
    </form>
  )
}

export { SpellerPage }
