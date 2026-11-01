'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CorrectInfo, ErrorInfo } from './speller-schema'
import type { CheckError } from '../api/check-text'
import { normalizeLineBreaks } from '../lib/normalize-line-breaks'
import { splitPages } from '../lib/split-pages'

type LongPageStatus = 'idle' | 'queued' | 'loading' | 'done' | 'failed'

interface LongPage {
  start: number // 원문 내 위치 (UTF-16)
  end: number
  status: LongPageStatus
  errInfo: CorrectInfo[] // 구간 로컬 좌표 (UTF-16으로 바꾼 값)
  error?: CheckError
}

// 되돌리기 한 번에 되돌릴 항목들의 이전 값
interface UndoEntry {
  keys: string[] // `${pageIdx}:${errorIdx}`
  prevCrtStr: (string | undefined)[]
  prevIgnored: boolean[]
}

interface LongCheckState {
  checkId: number // 검사를 새로 시작할 때마다 증가. 이전 검사의 늦은 응답을 버리는 데 쓴다
  originalText: string // 정규화된 원문
  isStrictCheck: boolean
  boundaryMode: 'predicted' | 'chained' // 대조 실패 시 'chained'로 전환
  pages: LongPage[]
  ignored: Record<string, true> // `${pageIdx}:${errorIdx}`
  selected: { pageIdx: number; errorIdx: number } | null
  undoStack: UndoEntry[]
}

// 응답이 어느 검사의 어느 구간에 대한 것인지 확인하는 값
interface PageRef {
  checkId: number
  pageIdx: number // pages 배열의 위치 (0부터)
  start: number
  end: number
}

const UNDO_LIMIT = 100

const initialState: LongCheckState = {
  checkId: 0,
  originalText: '',
  isStrictCheck: true,
  boundaryMode: 'predicted',
  pages: [],
  ignored: {},
  selected: null,
  undoStack: [],
}

const errorKey = (pageIdx: number, errorIdx: number) => `${pageIdx}:${errorIdx}`

const isBlank = (text: string) => text.trim() === ''

// 공백 · 개행만 있는 구간은 요청하지 않고 오류 없음으로 끝낸다
const createPage = (text: string, start: number, end: number): LongPage => ({
  start,
  end,
  status: isBlank(text.slice(start, end)) ? 'done' : 'idle',
  errInfo: [],
})

// 늦게 도착한 응답이 지금 상태의 같은 구간을 가리키는지 확인
const findPage = (state: LongCheckState, ref: PageRef) => {
  if (ref.checkId !== state.checkId) return null
  const page = state.pages[ref.pageIdx]
  if (!page || page.start !== ref.start || page.end !== ref.end) return null
  return page
}

const pushUndo = (state: LongCheckState, keys: string[]) => {
  const prevCrtStr = keys.map(key => {
    const [pageIdx, errorIdx] = key.split(':').map(Number)
    return state.pages[pageIdx]?.errInfo.find(e => e.errorIdx === errorIdx)
      ?.crtStr
  })
  const prevIgnored = keys.map(key => !!state.ignored[key])
  state.undoStack.push({ keys, prevCrtStr, prevIgnored })
  if (state.undoStack.length > UNDO_LIMIT) state.undoStack.shift()
}

const findError = (state: LongCheckState, key: string) => {
  const [pageIdx, errorIdx] = key.split(':').map(Number)
  return state.pages[pageIdx]?.errInfo.find(e => e.errorIdx === errorIdx)
}

const longCheckSlice = createSlice({
  name: 'longCheck',
  initialState,
  reducers: {
    startLongCheck: (
      state,
      action: PayloadAction<{ text: string; isStrictCheck: boolean }>,
    ) => {
      const text = normalizeLineBreaks(action.payload.text)
      return {
        ...initialState,
        checkId: state.checkId + 1,
        originalText: text,
        isStrictCheck: action.payload.isStrictCheck,
        pages: splitPages(text).map(({ start, end }) =>
          createPage(text, start, end),
        ),
      }
    },
    // 대기열이 쓰는 상태 변경. 완료 · 실패는 아래 두 액션으로만 바꾼다
    setPagesStatus: (
      state,
      action: PayloadAction<{
        pageIdxList: number[]
        status: 'idle' | 'queued' | 'loading'
      }>,
    ) => {
      action.payload.pageIdxList.forEach(pageIdx => {
        const page = state.pages[pageIdx]
        if (!page || page.status === 'done') return
        page.status = action.payload.status
        if (action.payload.status === 'loading') delete page.error
      })
    },
    pageCheckSucceeded: (
      state,
      action: PayloadAction<PageRef & { str: string; errInfo: ErrorInfo[] }>,
    ) => {
      const { str, errInfo, ...ref } = action.payload
      const page = findPage(state, ref)
      if (!page) return

      const text = state.originalText
      if (state.boundaryMode === 'predicted') {
        if (str === text.slice(page.start, page.end)) {
          page.status = 'done'
          page.errInfo = errInfo
          delete page.error
          return
        }
        // 예측이 서버 분할과 다르다. 예측을 버리고 처음부터 차례로 요청한다.
        // 응답을 받은 구간도 경계를 믿을 수 없으므로 결과와 교정을 모두 버린다.
        state.boundaryMode = 'chained'
        state.pages = [createPage(text, 0, text.length)]
        state.ignored = {}
        state.selected = null
        state.undoStack = []
        return
      }

      // 차례 요청: 마지막 구간에 나머지 전체를 보내고, 서버가 자른 만큼을 한 구간으로 확정한다
      const end = page.start + str.length
      if (str.length === 0 || text.slice(page.start, end) !== str) {
        page.status = 'failed'
        page.error = {
          kind: 'schema',
          httpStatus: null,
          errorCode: null,
          errorMessage: '응답 str이 원문의 해당 위치와 다름',
        }
        return
      }
      page.end = end
      page.status = 'done'
      page.errInfo = errInfo
      delete page.error
      if (end < text.length)
        state.pages.push(createPage(text, end, text.length))
    },
    pageCheckFailed: (
      state,
      action: PayloadAction<PageRef & { error: CheckError }>,
    ) => {
      const { error, ...ref } = action.payload
      const page = findPage(state, ref)
      if (!page) return

      // 빈 구간 차단이 새는 경우. 오류 없음으로 끝낸다
      if (error.kind === 'empty') {
        page.status = 'done'
        page.errInfo = []
        return
      }
      page.status = 'failed'
      page.error = error
    },
    // 여러 오류에 대치어를 한 번에 적용 (모두 수정 포함). crtStr이 undefined면 수정 취소
    applyLongCorrections: (
      state,
      action: PayloadAction<{ key: string; crtStr: string | undefined }[]>,
    ) => {
      const items = action.payload.filter(({ key }) => findError(state, key))
      if (items.length === 0) return
      pushUndo(
        state,
        items.map(({ key }) => key),
      )
      items.forEach(({ key, crtStr }) => {
        const info = findError(state, key)!
        info.crtStr = crtStr
        delete state.ignored[key]
      })
    },
    ignoreLongErrors: (state, action: PayloadAction<string[]>) => {
      const keys = action.payload.filter(key => findError(state, key))
      if (keys.length === 0) return
      pushUndo(state, keys)
      keys.forEach(key => {
        findError(state, key)!.crtStr = undefined
        state.ignored[key] = true
      })
    },
    undoLongCheck: state => {
      const entry = state.undoStack.pop()
      if (!entry) return
      entry.keys.forEach((key, i) => {
        const info = findError(state, key)
        if (info) info.crtStr = entry.prevCrtStr[i]
        if (entry.prevIgnored[i]) state.ignored[key] = true
        else delete state.ignored[key]
      })
    },
    selectLongError: (
      state,
      action: PayloadAction<LongCheckState['selected']>,
    ) => {
      state.selected = action.payload
    },
    resetLongCheck: state => ({
      ...initialState,
      checkId: state.checkId + 1,
    }),
  },
})

const {
  startLongCheck,
  setPagesStatus,
  pageCheckSucceeded,
  pageCheckFailed,
  applyLongCorrections,
  ignoreLongErrors,
  undoLongCheck,
  selectLongError,
  resetLongCheck,
} = longCheckSlice.actions
const longCheckReducer = longCheckSlice.reducer

export {
  startLongCheck,
  setPagesStatus,
  pageCheckSucceeded,
  pageCheckFailed,
  applyLongCorrections,
  ignoreLongErrors,
  undoLongCheck,
  selectLongError,
  resetLongCheck,
  longCheckReducer,
  errorKey,
  type LongCheckState,
  type LongPage,
  type LongPageStatus,
  type PageRef,
}
