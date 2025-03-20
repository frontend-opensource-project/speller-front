'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CheckResponse, CorrectInfo } from './speller-schema'
import { applyCorrections } from '../lib/apply-corrections'

type Response = CheckResponse & { requestedWithStrictMode: boolean }

interface SpellerState {
  text: string // 입력된 텍스트 원본
  displayText: string // 교정문서에 표시되는 텍스트
  response: Response
  responseMap: Record<number, Response>
  correctInfo: Record<number, Record<number, CorrectInfo>>
  selectedErrIdx: number
  currentPage: number
}

const initialState: SpellerState = {
  text: '',
  displayText: '',
  response: {
    str: '',
    errInfo: [],
    totalPageCnt: 0,
    remaningText: '',
    requestedWithStrictMode: false,
  },
  responseMap: {},
  correctInfo: {},
  selectedErrIdx: -1,
  currentPage: 1,
}

const spellerSlice = createSlice({
  name: 'speller',
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload
    },

    updateResponse: (state, action: PayloadAction<Response>) => {
      state.displayText = action.payload.str
      state.response = action.payload
      // 이미 해당 페이지의 correctInfo가 있을 경우 수정한 내용이 초기화되지 않도록 처리
      if (!state.correctInfo[state.currentPage]) {
        state.correctInfo[state.currentPage] = action.payload.errInfo.reduce(
          (acc, info) => ({ ...acc, [info.errorIdx]: info }),
          {},
        )
      }
    },

    updateCorrectInfo: (state, action: PayloadAction<CorrectInfo>) => {
      state.correctInfo[state.currentPage][action.payload.errorIdx] =
        action.payload

      state.displayText = applyCorrections(
        state.response.str,
        state.correctInfo[state.currentPage],
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

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
})

const {
  setText,
  updateResponse,
  updateCorrectInfo,
  setSelectedErrIdx,
  setResponseMap,
  resetResponseMap,
  setCurrentPage,
} = spellerSlice.actions
const spellerReducer = spellerSlice.reducer

export {
  setText,
  updateResponse,
  updateCorrectInfo,
  setSelectedErrIdx,
  setResponseMap,
  resetResponseMap,
  spellerReducer,
  setCurrentPage,
}
