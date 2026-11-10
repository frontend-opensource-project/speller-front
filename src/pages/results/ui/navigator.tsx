'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  CheckPayload,
  checkText,
  CHECK_ERROR_MESSAGE,
  NORMAL_PAGE_SIZE,
  type SpellerState,
  useSpeller,
  useSpellerRefs,
} from '@/entities/speller'
import { Spinner } from '@/shared/ui/spinner'
import { toast } from '@/shared/lib/use-toast'

const Navigator = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    response,
    responseMap,
    correctInfo,
    updateResponse,
    updateResponseMap,
  } = useSpeller()
  const { correctScrollContainerRef, errorScrollContainerRef } =
    useSpellerRefs()
  const [isFetching, setIsFetching] = useState(false)
  const currentPage = Number(searchParams?.get('page')) || 1
  const currentPageRef = useRef<number | null>(null)

  const createPageURL = (nextPage: number) => {
    if (!searchParams) return `${pathname}`

    const params = new URLSearchParams(searchParams)
    params.set('page', nextPage.toString())
    return `${pathname}?${params.toString()}`
  }

  // 성공하면 결과를 responseMap에 저장한다. 실패해도 예외를 던지지 않는다
  const fetchSpellCheck = async (
    payload: Required<Omit<CheckPayload, 'pageSize'>>,
  ) => {
    // 첫 검사와 같은 기준으로 나눠야 페이지 수가 맞는다
    const { data, error } = await checkText({
      ...payload,
      pageSize: NORMAL_PAGE_SIZE,
    })
    if (error) return { data: null, error }

    const response = {
      ...data,
      requestedWithStrictMode: payload.isStrictCheck,
    }
    updateResponseMap({ ...response, pageIdx: payload.pageIdx })
    return { data: response, error: null }
  }

  const handlePagination = async (page: number) => {
    if (isFetching) return

    let data: SpellerState['response'] | undefined = responseMap[page]
    if (!data) {
      setIsFetching(true)
      const result = await fetchSpellCheck({
        text: response.remaningText,
        isStrictCheck: response.requestedWithStrictMode,
        pageIdx: page,
      })
      setIsFetching(false)

      // 실패하면 현재 페이지에 머무르고, 화살표를 다시 눌러 재시도할 수 있다
      if (result.error) {
        toast({ description: CHECK_ERROR_MESSAGE[result.error.kind] })
        return
      }
      data = result.data
    }

    // 현재 페이지의 대치어 적용 정보 업데이트
    updateResponseMap({
      ...response,
      errInfo: Object.values(correctInfo),
      pageIdx: currentPage,
    })

    // 페이지 이동 시 섹션 스크롤 초기화
    if (correctScrollContainerRef?.current) {
      correctScrollContainerRef.current.scrollTo({ top: 0 })
    }
    if (errorScrollContainerRef?.current) {
      errorScrollContainerRef.current.scrollTo({ top: 0 })
    }

    updateResponse(data)
    router.push(createPageURL(page))
  }

  useEffect(() => {
    if (currentPageRef.current === currentPage) return
    ;(async () => {
      const isEmptyResponseMap = !responseMap?.[currentPage]
      const isFetchedNextPage = !!responseMap?.[currentPage + 1]
      const isNotNextPage = !responseMap?.[currentPage]?.remaningText

      // responseMap에 데이터가 없을 경우(맞춤법 검사 완료 이후)
      if (isEmptyResponseMap) {
        updateResponseMap({ ...response, pageIdx: currentPage })
        return
      }

      // 사전 페치가 이미 완료되었거나 다음 페이지가 없을 경우
      if (isFetchedNextPage || isNotNextPage) {
        currentPageRef.current = currentPage
        return
      }

      // 미리 받기 실패는 알리지 않는다. 다음 페이지로 이동할 때 다시 요청한다
      const { error } = await fetchSpellCheck({
        text: responseMap[currentPage].remaningText,
        isStrictCheck: responseMap[currentPage].requestedWithStrictMode,
        pageIdx: currentPage + 1,
      })
      if (error) console.error(error)
      currentPageRef.current = currentPage
    })()
  }, [response, responseMap, currentPage])

  useEffect(() => {
    if (response.totalPageCnt <= 1) return
    if (currentPage > 1) return // 1 페이지에서만 토스트 표시

    toast({
      variant: 'noIcon',
      description: `총 ${response.totalPageCnt} 페이지입니다.\n화살표를 눌러 페이지를 이동해 주세요.`,
    })
  }, [response.totalPageCnt])

  if (response.totalPageCnt <= 1) return null

  return (
    <div className='z-10 flex items-center gap-5 pc:gap-8'>
      <button
        className='inline-flex disabled:cursor-not-allowed disabled:opacity-50'
        onClick={() => {
          handlePagination(currentPage - 1)
        }}
        disabled={currentPage === 1}
      >
        <i className='inline-flex size-6 bg-icon-circle-arrow bg-contain bg-center bg-no-repeat pc:size-[1.875rem]' />
      </button>
      <span className='flex items-center gap-1 text-base font-medium text-slate-400 dark:text-dark-subtle pc:text-xl'>
        {isFetching ? (
          <Spinner />
        ) : (
          <>
            <span className='text-slate-600 dark:text-dark-text'>
              {currentPage}
            </span>
            /<span>{response.totalPageCnt}</span>
          </>
        )}
      </span>
      <button
        className='inline-flex disabled:cursor-not-allowed disabled:opacity-50'
        onClick={() => {
          handlePagination(currentPage + 1)
        }}
        disabled={currentPage === response.totalPageCnt}
      >
        <i className='inline-flex size-6 rotate-180 bg-icon-circle-arrow bg-contain bg-center bg-no-repeat pc:size-[1.875rem]' />
      </button>
    </div>
  )
}

export { Navigator }
