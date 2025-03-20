'use client'

import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '@/shared/lib/use-redux'
import {
  setText,
  updateResponse,
  updateCorrectInfo,
  setSelectedErrIdx,
  setResponseMap,
  resetResponseMap,
  type SpellerState,
  setCurrentPage,
} from './speller-slice'
import { CorrectInfo } from './speller-schema'

const useSpeller = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.speller)

  const handleTextChange = useCallback(
    (value: string) => {
      dispatch(setText(value))
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

  const updateCurrentPage = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page))
    },
    [dispatch],
  )

  return {
    ...state,
    handleTextChange,
    handleReceiveResponse,
    handleUpdateCorrectInfo,
    updateErrInfoIndex,
    updateResponseMap,
    initResponseMap,
    updateCurrentPage,
  }
}

export { useSpeller }
