'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CheckResponse, CorrectInfo } from './speller-schema'
import { applyCorrections } from '../lib/apply-corrections'

type Response = CheckResponse & { requestedWithStrictMode: boolean }

interface SpellerState {
  text: string // 입력된 텍스트 원본
  displayText: string // 교정문서에 표시되는 텍스트
  isStrictCheck: boolean // 강한 검사
  response: Response
  responseMap: Record<number, Response>
  correctInfo: Record<number, CorrectInfo>
  selectedErrIdx: number
}

const initialState: SpellerState = {
  text: '',
  displayText: '',
  isStrictCheck: false,
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
  spellerReducer,
  type SpellerState,
}
