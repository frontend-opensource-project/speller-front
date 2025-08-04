'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CheckResponse, CorrectInfo } from './speller-schema'
import { applyCorrections } from '../lib/apply-corrections'

type Response = CheckResponse & { requestedWithStrictMode: boolean }

interface SpellerState {
  originalText: string // 입력된 텍스트 원본
  displayText: string // 현재 페이지의 교정 문서에 표시되는 텍스트
  correctedText: string // 교정된 전체 텍스트
  isStrictCheck: boolean // 강한 검사 여부
  response: Response // 검사 결과
  responseMap: Record<number, Response> // 페이지별 검사 결과
  displayTextMap: Record<number, string> // 페이지별 교정 문서에 표시되는 텍스트
  correctInfo: Record<number, CorrectInfo> // 오류 정보
  selectedErrIdx: number // 선택된 오류 인덱스
  isAutoScroll: boolean // 자동 스크롤 여부
}

const initialState: SpellerState = {
  originalText: '',
  displayText: '',
  correctedText: '',
  isStrictCheck: false,
  response: {
    str: '',
    errInfo: [],
    totalPageCnt: 0,
    remaningText: '',
    requestedWithStrictMode: true,
  },
  responseMap: {},
  displayTextMap: {},
  correctInfo: {},
  selectedErrIdx: -1,
  isAutoScroll: true,
}

const spellerSlice = createSlice({
  name: 'speller',
  initialState,
  reducers: {
    setOriginalText: (state, action: PayloadAction<string>) => {
      state.originalText = action.payload
      state.correctedText = action.payload.replace(/(\r\n|\n|\r)/g, '')
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
    updateCorrectInfo: (
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

      let offset = 0 // 대치어 적용을 시작할 인덱스
      if (action.payload.pageIdx > 1) {
        for (let i = 1; i < action.payload.pageIdx; i++) {
          if (state.displayTextMap[i]) {
            // n 페이지의 시작 인덱스는 n-1 페이지까지의 길이를 더한 값
            offset += state.displayTextMap[i].length
          }
        }
      }

      state.correctedText = applyCorrections(
        state.originalText.replace(/(\r\n|\n|\r)/g, ''),
        state.correctInfo,
        offset,
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
      if (!state.responseMap) state.responseMap = {}
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
  setOriginalText,
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
  setOriginalText,
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
