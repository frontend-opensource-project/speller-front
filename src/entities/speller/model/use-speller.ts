'use client'

import { useCallback } from 'react'
import { shallowEqual } from 'react-redux'
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/shared/lib/use-redux'
import {
  setOriginalText,
  updateResponse,
  updateCorrectInfo,
  setSelectedErrIdx,
  setResponseMap,
  resetResponseMap,
  setStrictMode,
  setIsAutoScroll,
  type SpellerState,
} from './speller-slice'
import { CorrectInfo } from './speller-schema'

const useSpeller = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.speller, shallowEqual)
  const pathname = usePathname()

  const getCurrentPage = () => {
    const match = pathname?.match(/\/results\/(\d+)$/)
    return match ? Number(match[1]) : 1
  }

  const handleOriginalTextChange = useCallback(
    (value: string) => {
      dispatch(setOriginalText(value))
    },
    [dispatch],
  )

  const updateStrictCheckMode = useCallback(
    (value: boolean) => {
      dispatch(setStrictMode(value))
    },
    [dispatch],
  )

  const handleReceiveResponse = useCallback(
    (payload: SpellerState['response']) => {
      dispatch(updateResponse(payload))
    },
    [dispatch],
  )

  const handleUpdateCorrectInfo = useCallback(
    (payload: CorrectInfo) => {
      const pageIdx = getCurrentPage()
      dispatch(updateCorrectInfo({ ...payload, pageIdx }))
    },
    [dispatch, getCurrentPage],
  )

  const updateErrInfoIndex = useCallback(
    (index: number) => {
      dispatch(setSelectedErrIdx(index))
    },
    [dispatch],
  )

  const updateResponseMap = useCallback(
    (payload: SpellerState['response'] & { pageIdx: number }) => {
      dispatch(setResponseMap(payload))
    },
    [dispatch],
  )

  const initResponseMap = useCallback(() => {
    dispatch(resetResponseMap())
  }, [dispatch])

  const updateIsAutoScroll = useCallback(
    (value: boolean) => {
      dispatch(setIsAutoScroll(value))
    },
    [dispatch],
  )

  return {
    ...state,
    handleOriginalTextChange,
    updateStrictCheckMode,
    handleReceiveResponse,
    handleUpdateCorrectInfo,
    updateErrInfoIndex,
    updateResponseMap,
    initResponseMap,
    updateIsAutoScroll,
  }
}

export { useSpeller }
