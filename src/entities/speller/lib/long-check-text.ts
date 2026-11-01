import type { CorrectInfo } from '../model/speller-schema'
import type { LongCheckState } from '../model/long-check-slice'
import { errorKey } from '../model/long-check-slice'
import { applyCorrections } from './apply-corrections'

type LongTextState = Pick<LongCheckState, 'originalText' | 'pages' | 'ignored'>

// 구간 요청에 보낼 텍스트. 차례 요청 모드에서는 마지막 구간이 나머지 전체다
const getPageText = (state: LongTextState, pageIdx: number) => {
  const page = state.pages[pageIdx]
  return page ? state.originalText.slice(page.start, page.end) : ''
}

// 무시한 오류는 대치어를 적용하지 않는다
const getCorrectedPageText = (state: LongTextState, pageIdx: number) => {
  const page = state.pages[pageIdx]
  if (!page) return ''
  const applied = page.errInfo.reduce<Record<number, CorrectInfo>>(
    (acc, info) => {
      if (!state.ignored[errorKey(pageIdx, info.errorIdx)]) {
        acc[info.errorIdx] = info
      }
      return acc
    },
    {},
  )
  return applyCorrections(getPageText(state, pageIdx), applied)
}

// 전체 교정문. 검사하지 않은 구간은 원문 그대로 들어간다
const getCorrectedText = (state: LongTextState) =>
  state.pages.map((_, pageIdx) => getCorrectedPageText(state, pageIdx)).join('')

const getLongProgress = (state: Pick<LongCheckState, 'pages'>) => {
  const done = state.pages.filter(page => page.status === 'done').length
  return { done, total: state.pages.length }
}

export { getPageText, getCorrectedPageText, getCorrectedText, getLongProgress }
