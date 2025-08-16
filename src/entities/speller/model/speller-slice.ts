'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CheckResponse, CorrectInfo } from './speller-schema'
import { applyCorrections } from '../lib/apply-corrections'

type Response = CheckResponse & {
  requestedWithStrictMode: boolean // 강한 검사 모드 여부
}
type ResponseMap = Record<
  number,
  Response & {
    start: number // 원문에서 현재 페이지의 시작 인덱스
    end: number // 원문에서 현재 페이지의 끝 인덱스
  }
>

interface SpellerState {
  originalText: string // 입력된 텍스트 원본
  response: Response // 검사 결과
  responseMap: ResponseMap // 페이지별 검사 결과
  displayText: string // 현재 페이지의 교정 문서에 표시되는 텍스트
  displayTextMap: Record<number, string> // 페이지별 교정 문서에 표시되는 텍스트
  correctInfo: Record<number, CorrectInfo> // 오류 정보
  selectedErrIdx: number // 선택된 오류 인덱스
  isStrictCheck: boolean // 강한 검사 체크 여부
  isAutoScroll: boolean // 자동 스크롤 여부
}

const initialState: SpellerState = {
  originalText: '',
  response: {
    str: '',
    errInfo: [],
    totalPageCnt: 0,
    remaningText: '',
    requestedWithStrictMode: true,
  },
  responseMap: {},
  displayText: '',
  displayTextMap: {},
  correctInfo: {},
  selectedErrIdx: -1,
  isStrictCheck: true,
  isAutoScroll: true,
}

const spellerSlice = createSlice({
  name: 'speller',
  initialState,
  reducers: {
    setOriginalText: (state, action: PayloadAction<string>) => {
      state.originalText = action.payload
    },
    setResponse: (state, action: PayloadAction<Response>) => {
      state.displayText = action.payload.str
      state.response = action.payload
      state.correctInfo = action.payload.errInfo.reduce(
        (acc, info) => ({ ...acc, [info.errorIdx]: info }),
        {},
      )
    },
    setResponseMap: (
      state,
      action: PayloadAction<Response & { pageIdx: number }>,
    ) => {
      const { pageIdx, ...response } = action.payload

      // 현재 페이지의 원문의 시작과 끝이 전체 원문에서 몇 번째 인덱스인지 계산
      const prevResponse = state.responseMap[pageIdx - 1]
      const start = prevResponse?.end ?? 0
      const end = start + response.str.length

      if (!state.responseMap) state.responseMap = {}
      state.responseMap[pageIdx] = { ...response, start, end }

      if (state.displayTextMap[pageIdx]) return
      state.displayTextMap[pageIdx] = response.str
    },
    setCorrectInfo: (
      state,
      action: PayloadAction<CorrectInfo & { pageIdx: number }>,
    ) => {
      state.correctInfo[action.payload.errorIdx] = action.payload
      state.displayText = applyCorrections(
        state.response.str,
        state.correctInfo,
      )

      if (!state.displayTextMap) state.displayTextMap = {}
      state.displayTextMap[action.payload.pageIdx] = state.displayText
    },
    setSelectedErrIdx: (state, action: PayloadAction<number>) => {
      state.selectedErrIdx = action.payload
    },
    setStrictMode: (state, action: PayloadAction<boolean>) => {
      state.isStrictCheck = action.payload
    },
    setAutoScrollMode: (state, action: PayloadAction<boolean>) => {
      state.isAutoScroll = action.payload
    },
    resetResponseMap: state => {
      state.responseMap = {}
    },
    resetDisplayTextMap: state => {
      state.displayTextMap = {}
    },
  },
})

const {
  setOriginalText,
  setResponse,
  setResponseMap,
  setCorrectInfo,
  setSelectedErrIdx,
  setStrictMode,
  setAutoScrollMode,
  resetResponseMap,
  resetDisplayTextMap,
} = spellerSlice.actions
const spellerReducer = spellerSlice.reducer

export {
  setOriginalText,
  setResponse,
  setResponseMap,
  setCorrectInfo,
  setSelectedErrIdx,
  setStrictMode,
  setAutoScrollMode,
  resetResponseMap,
  resetDisplayTextMap,
  spellerReducer,
  type SpellerState,
}
