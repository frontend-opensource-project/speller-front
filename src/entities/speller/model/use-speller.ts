'use client'

import { useCallback } from 'react'
import { shallowEqual } from 'react-redux'
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/shared/lib/use-redux'
import {
  setOriginalText,
  setResponse,
  setResponseMap,
  setCorrectInfo,
  setSelectedErrIdx,
  setStrictMode,
  setAutoScrollMode,
  resetResponseMap,
  resetDisplayTextMap,
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

  const updateResponse = useCallback(
    (payload: SpellerState['response']) => {
      dispatch(setResponse(payload))
    },
    [dispatch],
  )

  const updateResponseMap = useCallback(
    (payload: SpellerState['response'] & { pageIdx: number }) => {
      dispatch(setResponseMap(payload))
    },
    [dispatch],
  )

  const updateCorrectInfo = useCallback(
    (payload: CorrectInfo) => {
      const pageIdx = getCurrentPage()
      dispatch(setCorrectInfo({ ...payload, pageIdx }))
    },
    [dispatch, getCurrentPage],
  )

  const updateErrInfoIndex = useCallback(
    (index: number) => {
      dispatch(setSelectedErrIdx(index))
    },
    [dispatch],
  )

  const updateStrictMode = useCallback(
    (value: boolean) => {
      dispatch(setStrictMode(value))
    },
    [dispatch],
  )

  const updateAutoScrollMode = useCallback(
    (value: boolean) => {
      dispatch(setAutoScrollMode(value))
    },
    [dispatch],
  )

  const initResponseMap = useCallback(() => {
    dispatch(resetResponseMap())
  }, [dispatch])

  const initDisplayTextMap = useCallback(() => {
    dispatch(resetDisplayTextMap())
  }, [dispatch])

  return {
    ...state,
    handleOriginalTextChange,
    updateResponse,
    updateResponseMap,
    updateCorrectInfo,
    updateErrInfoIndex,
    updateStrictMode,
    updateAutoScrollMode,
    initResponseMap,
    initDisplayTextMap,
  }
}

export { useSpeller }
