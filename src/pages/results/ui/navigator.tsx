'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSpeller } from '@/entities/speller'
import { clientSpellCheck } from '../api/client-spell-check'
import { toast } from '@/shared/lib/use-toast'

const Navigator = () => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { response, responseMap, handleReceiveResponse, updateResponseMap } =
    useSpeller()
  const currentPage = Number(searchParams?.get('page')) || 1

  const createPageURL = (nextPage: number) => {
    if (!searchParams) return `${pathname}`

    const params = new URLSearchParams(searchParams)
    params.set('page', nextPage.toString())
    return `${pathname}?${params.toString()}`
  }

  const handlePagination = (page: number) => {
    try {
      handleReceiveResponse({ ...responseMap[page] })
    } catch (error) {
      throw new Error(error as string)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (!responseMap?.[currentPage]) {
        updateResponseMap({ ...response, pageIdx: currentPage })
      }

      if (!!responseMap?.[currentPage + 1]) return
      if (!responseMap?.[currentPage]?.remaningText) return

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
    })()
  }, [currentPage, response, responseMap, updateResponseMap])

  useEffect(() => {
    toast({
      variant: 'noIcon',
      description: `총 ${response.totalPageCnt} 페이지입니다.\n화살표를 눌러 페이지를 이동해 주세요.`,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    response.totalPageCnt > 1 && (
      <div className='flex items-center gap-5'>
        <button
          className='inline-flex'
          onClick={() => {
            handlePagination(currentPage - 1)
            push(createPageURL(currentPage - 1))
          }}
          disabled={currentPage === 1}
        >
          <i className='inline-flex size-6 bg-icon-circle-arrow bg-contain bg-center bg-no-repeat' />
        </button>
        <span className='flex items-center gap-1 text-base font-medium text-slate-400'>
          <span className='text-slate-600'>{currentPage}</span>/
          <span>{response.totalPageCnt}</span>
        </span>
        <button
          className='inline-flex'
          onClick={() => {
            handlePagination(currentPage + 1)
            push(createPageURL(currentPage + 1))
          }}
          disabled={currentPage === response.totalPageCnt}
        >
          <i className='inline-flex size-6 rotate-180 bg-icon-circle-arrow bg-contain bg-center bg-no-repeat' />
        </button>
      </div>
    )
  )
}

export { Navigator }
