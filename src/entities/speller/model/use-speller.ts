'use client'

import { useCallback, useMemo } from 'react'
import { shallowEqual } from 'react-redux'

import { useAppDispatch, useAppSelector } from '@/shared/lib/use-redux'
import {
  setText,
  updateResponse,
  updateCorrectInfo,
  setSelectedErrIdx,
  setResponseMap,
  resetResponseMap,
  type SpellerState,
  setStrictMode,
} from './speller-slice'
import { CorrectInfo } from './speller-schema'

const useSpeller = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.speller, shallowEqual)

  const handleTextChange = useCallback(
    (value: string) => {
      dispatch(setText(value))
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
      dispatch(updateCorrectInfo(payload))
    },
    [dispatch],
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

  return {
    ...state,
    handleTextChange,
    updateStrictCheckMode,
    handleReceiveResponse,
    handleUpdateCorrectInfo,
    updateErrInfoIndex,
    updateResponseMap,
    initResponseMap,
  }
}

export const useSpellerActions = () => {
  const dispatch = useAppDispatch()

  return useMemo(
    () => ({
      handleTextChange: (value: string) => {
        dispatch(setText(value))
      },
      updateStrictCheckMode: (value: boolean) => {
        dispatch(setStrictMode(value))
      },
      handleReceiveResponse: (payload: SpellerState['response']) => {
        dispatch(updateResponse(payload))
      },
      handleUpdateCorrectInfo: (payload: CorrectInfo) => {
        dispatch(updateCorrectInfo(payload))
      },
      updateErrInfoIndex: (index: number) => {
        dispatch(setSelectedErrIdx(index))
      },
      updateResponseMap: (
        payload: SpellerState['response'] & { pageIdx: number },
      ) => {
        dispatch(setResponseMap(payload))
      },
      initResponseMap: () => {
        dispatch(resetResponseMap())
      },
    }),
    [dispatch],
  )
}

export { useSpeller }
