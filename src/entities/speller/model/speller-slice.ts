'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CheckResponse, CorrectInfo } from './speller-schema'
import { applyCorrections } from '../lib/apply-corrections'

type Response = CheckResponse & { requestedWithStrictMode: boolean }

interface SpellerState {
  text: string // 입력된 텍스트 원본
  displayText: string // 교정 문서에 표시되는 텍스트
  isStrictCheck: boolean // 강한 검사 여부
  response: Response // 검사 결과
  responseMap: Record<number, Response> // 페이지별 검사 결과
  correctInfo: Record<number, CorrectInfo> // 오류 정보
  selectedErrIdx: number // 선택된 오류 인덱스
  isAutoScroll: boolean // 자동 스크롤 여부
}

const initialState: SpellerState = {
  text: '',
  displayText: '',
  isStrictCheck: true,
  response: {
    str: '',
    errInfo: [],
    totalPageCnt: 0,
    remaningText: '',
    requestedWithStrictMode: true,
  },
  responseMap: {},
  correctInfo: {},
  selectedErrIdx: -1,
  isAutoScroll: true,
}

const spellerSlice = createSlice({
  name: 'speller',
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload
    },
    setStrictMode: (state, action: PayloadAction<boolean>) => {
      state.isStrictCheck = action.payload
    },
    updateResponse: (state, action: PayloadAction<Response>) => {
      state.displayText = action.payload.str
      state.response = action.payload
      state.correctInfo = action.payload.errInfo.reduce(
        (acc, info) => ({ ...acc, [info.errorIdx]: info }),
        {},
      )
    },
    updateCorrectInfo: (state, action: PayloadAction<CorrectInfo>) => {
      state.correctInfo[action.payload.errorIdx] = action.payload

      state.displayText = applyCorrections(
        state.response.str,
        state.correctInfo,
      )
    },
    setSelectedErrIdx: (state, action: PayloadAction<number>) => {
      state.selectedErrIdx = action.payload
    },
    setResponseMap: (
      state,
      action: PayloadAction<Response & { pageIdx: number }>,
    ) => {
      const { pageIdx, ...response } = action.payload
      state.responseMap[pageIdx] = response
    },
    resetResponseMap: state => {
      state.responseMap = {}
    },
    setIsAutoScroll: (state, action: PayloadAction<boolean>) => {
      state.isAutoScroll = action.payload
    },
  },
})

const {
  setText,
  setStrictMode,
  updateResponse,
  updateCorrectInfo,
  setSelectedErrIdx,
  setResponseMap,
  resetResponseMap,
  setIsAutoScroll,
} = spellerSlice.actions
const spellerReducer = spellerSlice.reducer

export {
  setText,
  setStrictMode,
  updateResponse,
  updateCorrectInfo,
  setSelectedErrIdx,
  setResponseMap,
  resetResponseMap,
  setIsAutoScroll,
  spellerReducer,
  type SpellerState,
}
