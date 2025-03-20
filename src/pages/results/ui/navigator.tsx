'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSpeller } from '@/entities/speller'
import { Spinner } from '@/shared/ui/spinner'
import { toast } from '@/shared/lib/use-toast'
import { clientSpellCheck } from '../api/client-spell-check'

const Navigator = () => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    response,
    responseMap,
    handleReceiveResponse,
    updateResponseMap,
    updateCurrentPage,
  } = useSpeller()
  const [isUpdatedResponseMap, setIsUpdatedResponseMap] = useState(false)
  const currentPage = Number(searchParams?.get('page')) || 1
  const currentPageRef = useRef<number | null>(null)

  const createPageURL = (nextPage: number) => {
    if (!searchParams) return `${pathname}`

    const params = new URLSearchParams(searchParams)
    params.set('page', nextPage.toString())
    return `${pathname}?${params.toString()}`
  }

  const handlePagination = (page: number) => {
    try {
      updateCurrentPage(page)
      handleReceiveResponse({ ...responseMap[page] })
    } catch (error) {
      throw new Error(error as string)
    }
  }

  useEffect(() => {
    if (currentPageRef.current === currentPage) return
    ;(async () => {
      const isEmptyResponseMap = !responseMap?.[currentPage]
      const isFetchedNextPage = !!responseMap?.[currentPage + 1]
      const isNewSpellCheck = responseMap?.[currentPage]?.str !== response?.str
      const isNotNextPage = !responseMap?.[currentPage]?.remaningText

      if (isEmptyResponseMap) {
        updateResponseMap({ ...response, pageIdx: currentPage })
      }

      if ((isFetchedNextPage || isNotNextPage) && !isNewSpellCheck) {
        setIsUpdatedResponseMap(true)
        currentPageRef.current = currentPage
        return
      }

      if (!isEmptyResponseMap && !isFetchedNextPage && !isNotNextPage) {
        const nextPageResponse = await clientSpellCheck({
          text: responseMap[currentPage].remaningText,
          isStrictCheck: responseMap[currentPage].requestedWithStrictMode,
          pageIdx: currentPage + 1,
        })
        updateResponseMap({
          ...nextPageResponse,
          requestedWithStrictMode:
            responseMap[currentPage].requestedWithStrictMode,
          pageIdx: currentPage + 1,
        })
        setIsUpdatedResponseMap(true)
        currentPageRef.current = currentPage
      }
    })()
  }, [response, responseMap, currentPage])

  useEffect(() => {
    if (isUpdatedResponseMap) {
      toast({
        variant: 'noIcon',
        description: `총 ${response.totalPageCnt} 페이지입니다.\n화살표를 눌러 페이지를 이동해 주세요.`,
      })
    }
  }, [isUpdatedResponseMap])

  return (
    response.totalPageCnt > 1 && (
      <div className='z-10 flex items-center gap-5 pc:gap-8'>
        <button
          className='inline-flex disabled:cursor-not-allowed disabled:opacity-50'
          onClick={() => {
            handlePagination(currentPage - 1)
            push(createPageURL(currentPage - 1))
          }}
          disabled={!isUpdatedResponseMap || currentPage === 1}
        >
          <i className='inline-flex size-6 bg-icon-circle-arrow bg-contain bg-center bg-no-repeat pc:size-[1.875rem]' />
        </button>
        <span className='flex items-center gap-1 text-base font-medium text-slate-400 pc:text-xl'>
          {isUpdatedResponseMap ? (
            <>
              <span className='text-slate-600'>{currentPage}</span>/
              <span>{response.totalPageCnt}</span>
            </>
          ) : (
            <Spinner />
          )}
        </span>
        <button
          className='inline-flex disabled:cursor-not-allowed disabled:opacity-50'
          onClick={() => {
            handlePagination(currentPage + 1)
            push(createPageURL(currentPage + 1))
          }}
          disabled={
            !isUpdatedResponseMap || currentPage === response.totalPageCnt
          }
        >
          <i className='inline-flex size-6 rotate-180 bg-icon-circle-arrow bg-contain bg-center bg-no-repeat pc:size-[1.875rem]' />
        </button>
      </div>
    )
  )
}

export { Navigator }
