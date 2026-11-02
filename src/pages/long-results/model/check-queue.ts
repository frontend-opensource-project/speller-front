import type { UnknownAction } from '@reduxjs/toolkit'
import {
  checkText,
  getPageText,
  type CheckError,
  pageCheckFailed,
  pageCheckSucceeded,
  setPagesStatus,
  type LongCheckState,
} from '@/entities/speller'
import {
  EMPTY_VIEWPORT,
  orderFromViewport,
  type ViewportPages,
} from '../lib/order-pages'

const MAX_IN_FLIGHT = 2 // 엔진 부하를 고려한 동시 요청 수

interface CheckQueueDeps {
  getState: () => LongCheckState
  dispatch: (action: UnknownAction) => void
  check?: typeof checkText
  onChange?: () => void // 멈춤 · 요청 수 등 화면에 보여줄 값이 바뀜
  onPageFailed?: (pageIdx: number, error: CheckError) => void // 지금 검사의 구간이 실패함 (429 포함)
  onBoundaryMismatch?: (pageIdx: number) => void // 예측한 구간과 서버 응답이 달라 차례 검사로 바뀜
}

/**
 * 긴글 모드 구간 검사 대기열.
 * 스크롤이 멈출 때마다 아직 보내지 않은 구간의 순서를 다시 짜고, 동시에 2개까지 보낸다.
 */
class CheckQueue {
  readonly #deps: CheckQueueDeps & { check: typeof checkText }
  #checkId = -1
  #structure = '' // 구간 수 · 경계 방식. 바뀌면 구간 번호가 달라진다
  #viewport: ViewportPages = EMPTY_VIEWPORT
  #order: number[] = [] // 보낼 순서
  #priority: number[] = [] // 스크롤 중에도 먼저 보낼 구간 (키보드 이동 · 다시 시도)
  #inFlight = new Set<string>() // 보낸 구간의 위치 키. 구간 번호는 차례 요청으로 바뀔 수 있다
  #allRequested = false // "남은 부분 모두 검사": 범위 밖이어도 빼지 않는다
  #scrolling = false
  #paused = false // 429를 받으면 멈춘다
  #consecutiveTimeouts = 0

  constructor(deps: CheckQueueDeps) {
    this.#deps = { check: checkText, ...deps }
  }

  get paused() {
    return this.#paused
  }

  get inFlightCount() {
    return this.#inFlight.size
  }

  get allRequested() {
    return this.#allRequested
  }

  // 시간 초과가 연달아 3번이면 문단을 나눠 보라고 안내한다
  get consecutiveTimeouts() {
    return this.#consecutiveTimeouts
  }

  // 스크롤이 멈췄거나 구간 배치가 바뀌었을 때
  updateViewport(viewport: ViewportPages) {
    this.#viewport = viewport
    this.#replan()
  }

  setScrolling(scrolling: boolean) {
    this.#scrolling = scrolling
    if (!scrolling) this.#pump()
  }

  requestAll() {
    this.#allRequested = true
    this.#replan()
  }

  // 키보드로 검사 끝을 넘어갔을 때 다음 구간을 맨 앞에 넣는다
  prioritize(pageIdx: number) {
    const page = this.#deps.getState().pages[pageIdx]
    if (!page || (page.status !== 'idle' && page.status !== 'queued')) return
    this.#addPriority(pageIdx)
  }

  retry(pageIdx: number) {
    const page = this.#deps.getState().pages[pageIdx]
    if (!page || page.status !== 'failed') return
    this.#addPriority(pageIdx)
  }

  resume() {
    if (!this.#paused) return
    this.#paused = false
    this.#notify()
    this.#pump()
  }

  #addPriority(pageIdx: number) {
    this.#priority = [pageIdx, ...this.#priority.filter(i => i !== pageIdx)]
    this.#order = [pageIdx, ...this.#order.filter(i => i !== pageIdx)]
    this.#deps.dispatch(
      setPagesStatus({ pageIdxList: [pageIdx], status: 'queued' }),
    )
    this.#pump()
  }

  // 새 검사가 시작됐거나 구간 번호가 바뀌었으면 쌓아 둔 번호를 버린다
  #syncStructure(state: LongCheckState) {
    const structure = `${state.boundaryMode}:${state.pages.length}`
    if (state.checkId !== this.#checkId) {
      this.#checkId = state.checkId
      this.#allRequested = false
      this.#paused = false
      this.#consecutiveTimeouts = 0
      this.#inFlight.clear()
      this.#priority = []
    } else if (structure !== this.#structure) {
      this.#priority = []
    }
    this.#structure = structure
  }

  #replan() {
    const state = this.#deps.getState()
    this.#syncStructure(state)

    const isWaiting = (i: number) =>
      state.pages[i]?.status === 'idle' || state.pages[i]?.status === 'queued'
    const inRange = new Set([
      ...this.#viewport.visible,
      ...this.#viewport.below,
      ...this.#viewport.above,
    ])
    const priority = this.#priority.filter(
      i => isWaiting(i) || state.pages[i]?.status === 'failed',
    )
    const rest = orderFromViewport(this.#viewport, state.pages.length).filter(
      i =>
        isWaiting(i) &&
        !this.#isInFlight(state, i) &&
        !priority.includes(i) &&
        (this.#allRequested || inRange.has(i)),
    )
    this.#priority = priority
    this.#order = [...priority, ...rest]

    const next = new Set(this.#order)
    const toIdle = state.pages.flatMap((page, i) =>
      page.status === 'queued' && !next.has(i) ? [i] : [],
    )
    const toQueued = this.#order.filter(i => state.pages[i].status !== 'queued')
    if (toIdle.length > 0) {
      this.#deps.dispatch(
        setPagesStatus({ pageIdxList: toIdle, status: 'idle' }),
      )
    }
    if (toQueued.length > 0) {
      this.#deps.dispatch(
        setPagesStatus({ pageIdxList: toQueued, status: 'queued' }),
      )
    }
    this.#pump()
  }

  #pump() {
    const state = this.#deps.getState()
    while (!this.#paused && this.#inFlight.size < MAX_IN_FLIGHT) {
      // 스크롤 중에는 우선 구간만 보낸다
      const next = this.#order.find(
        i =>
          !this.#isInFlight(state, i) &&
          (!this.#scrolling || this.#priority.includes(i)),
      )
      if (next === undefined) return
      void this.#send(next)
    }
  }

  async #send(pageIdx: number) {
    const state = this.#deps.getState()
    const page = state.pages[pageIdx]
    this.#order = this.#order.filter(i => i !== pageIdx)
    this.#priority = this.#priority.filter(i => i !== pageIdx)
    if (!page) return

    const ref = {
      checkId: state.checkId,
      pageIdx,
      start: page.start,
      end: page.end,
    }
    const key = this.#inFlightKey(state, pageIdx)
    this.#inFlight.add(key)
    this.#deps.dispatch(
      setPagesStatus({ pageIdxList: [pageIdx], status: 'loading' }),
    )
    this.#notify()

    const result = await this.#deps.check({
      text: getPageText(state, pageIdx),
      isStrictCheck: state.isStrictCheck,
      pageIdx: pageIdx + 1,
    })

    // 그사이 새 검사가 시작됐으면 이 응답은 슬라이스가 버린다
    const isCurrent = this.#deps.getState().checkId === ref.checkId
    // 이 응답으로 구간 예측이 어긋났는지 보려고 반영 전 경계 방식을 기억한다
    const modeBefore = this.#deps.getState().boundaryMode
    this.#inFlight.delete(key)

    if (result.error && isCurrent) {
      this.#deps.onPageFailed?.(pageIdx, result.error)
    }

    if (result.error?.kind === 'rate' && isCurrent) {
      // 멈추고, 이 구간은 다시 시작할 때 가장 먼저 보낸다
      this.#paused = true
      this.#priority = [pageIdx, ...this.#priority]
      this.#order = [pageIdx, ...this.#order]
      this.#deps.dispatch(
        setPagesStatus({ pageIdxList: [pageIdx], status: 'queued' }),
      )
      this.#notify()
      return
    }

    if (result.error) {
      if (isCurrent && result.error.kind === 'timeout') {
        this.#consecutiveTimeouts++
      }
      this.#deps.dispatch(pageCheckFailed({ ...ref, error: result.error }))
    } else {
      if (isCurrent) this.#consecutiveTimeouts = 0
      this.#deps.dispatch(
        pageCheckSucceeded({
          ...ref,
          str: result.data.str,
          errInfo: result.data.errInfo,
        }),
      )
    }
    this.#notify()
    if (!isCurrent) return

    if (
      !result.error &&
      modeBefore === 'predicted' &&
      this.#deps.getState().boundaryMode === 'chained'
    ) {
      this.#deps.onBoundaryMismatch?.(pageIdx)
    }

    // 대조 실패로 차례 요청이 됐거나, 차례 요청에서 다음 구간이 생겼으면 순서를 다시 짠다
    const after = this.#deps.getState()
    if (`${after.boundaryMode}:${after.pages.length}` !== this.#structure) {
      this.#replan()
    } else {
      this.#pump()
    }
  }

  #inFlightKey(state: LongCheckState, pageIdx: number) {
    const page = state.pages[pageIdx]
    return page ? `${state.checkId}:${page.start}:${page.end}` : ''
  }

  #isInFlight(state: LongCheckState, pageIdx: number) {
    return this.#inFlight.has(this.#inFlightKey(state, pageIdx))
  }

  #notify() {
    this.#deps.onChange?.()
  }
}

export { CheckQueue, MAX_IN_FLIGHT, type CheckQueueDeps }
