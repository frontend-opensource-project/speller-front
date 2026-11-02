import { errorKey, type LongCheckState } from '@/entities/speller'
import { isProcessed, type ErrorGroupItem } from './group-errors'

type NavState = Pick<LongCheckState, 'pages' | 'ignored'>

interface ErrorPosition {
  pageIdx: number
  start: number
}

const compare = (a: ErrorPosition, b: ErrorPosition) =>
  a.pageIdx - b.pageIdx || a.start - b.start

const pendingInPage = (
  state: NavState,
  pageIdx: number,
  hiddenMethods: number[],
): ErrorGroupItem[] =>
  [...state.pages[pageIdx].errInfo]
    .sort((a, b) => a.start - b.start)
    .map(info => ({ key: errorKey(pageIdx, info.errorIdx), pageIdx, info }))
    .filter(
      item =>
        !isProcessed(state, item) &&
        !hiddenMethods.includes(item.info.correctMethod),
    )

/** 검사를 마친 구간에서 아직 처리하지 않은 오류를 문서 순서로 늘어놓는다 */
const listPendingErrors = (
  state: NavState,
  hiddenMethods: number[] = [],
): ErrorGroupItem[] =>
  state.pages.flatMap((page, pageIdx) =>
    page.status === 'done' ? pendingInPage(state, pageIdx, hiddenMethods) : [],
  )

/** 현재 위치의 바로 앞(-1) · 뒤(1) 오류. 현재 오류는 처리했어도 기준 위치가 된다 */
const findAdjacentError = (
  items: ErrorGroupItem[],
  current: ErrorPosition,
  direction: 1 | -1,
): ErrorGroupItem | null => {
  const position = (item: ErrorGroupItem) => ({
    pageIdx: item.pageIdx,
    start: item.info.start,
  })
  if (direction === 1) {
    return items.find(item => compare(position(item), current) > 0) ?? null
  }
  return items.findLast(item => compare(position(item), current) < 0) ?? null
}

/**
 * 화면에 들어왔을 때 열 첫 오류.
 * 앞 구간이 아직 검사 중이면 그보다 앞에 오류가 나올 수 있어 undefined(기다림)를,
 * 모든 구간을 마쳤는데 오류가 없으면 null을 돌려준다.
 */
const findFirstError = (
  state: NavState,
  hiddenMethods: number[] = [],
): ErrorGroupItem | null | undefined => {
  for (let pageIdx = 0; pageIdx < state.pages.length; pageIdx++) {
    const { status } = state.pages[pageIdx]
    if (status === 'failed') continue
    if (status !== 'done') return undefined
    const [first] = pendingInPage(state, pageIdx, hiddenMethods)
    if (first) return first
  }
  return null
}

export {
  listPendingErrors,
  findAdjacentError,
  findFirstError,
  type ErrorPosition,
}
