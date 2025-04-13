'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CheckPayload, useSpeller, useSpellerRefs } from '@/entities/speller'
import { Spinner } from '@/shared/ui/spinner'
import { toast } from '@/shared/lib/use-toast'
import { spellCheckAction } from '../api/spell-check-action'

const Navigator = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    response,
    responseMap,
    correctInfo,
    handleReceiveResponse,
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

  const fetchSpellCheck = async (payload: Required<CheckPayload>) => {
    const response = await spellCheckAction(payload)
    updateResponseMap({
      ...response,
      requestedWithStrictMode: payload.isStrictCheck,
      pageIdx: payload.pageIdx,
    })
    return response
  }

  const handlePagination = async (page: number) => {
    let data = null
    try {
      if (isFetching) return
      if (responseMap[page]) {
        data = responseMap[page]
      } else {
        setIsFetching(true)
        const res = await fetchSpellCheck({
          text: response.remaningText,
          isStrictCheck: response.requestedWithStrictMode,
          pageIdx: page,
        })
        data = {
          ...res,
          requestedWithStrictMode: response.requestedWithStrictMode,
        }
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

      handleReceiveResponse(data)
      router.push(createPageURL(page))
      setIsFetching(false)
    } catch (error) {
      throw new Error(error as string)
    }
  }

  useEffect(() => {
    if (currentPageRef.current === currentPage) return
    ;(async () => {
      try {
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

        await fetchSpellCheck({
          text: responseMap[currentPage].remaningText,
          isStrictCheck: responseMap[currentPage].requestedWithStrictMode,
          pageIdx: currentPage + 1,
        })
        currentPageRef.current = currentPage
      } catch (error) {
        console.error(error)
        setIsFetching(false)
      }
    })()
  }, [response, responseMap, currentPage])

  useEffect(() => {
    if (response.totalPageCnt <= 1) return
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
      <span className='flex items-center gap-1 text-base font-medium text-slate-400 pc:text-xl'>
        {isFetching ? (
          <Spinner />
        ) : (
          <>
            <span className='text-slate-600'>{currentPage}</span>/
            <span>{response.totalPageCnt}</span>
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
