// 스크롤이 멈춘 순간 각 구간이 화면과 어떤 관계인지
interface ViewportPages {
  visible: number[] // 화면에 보이는 구간 (위→아래)
  below: number[] // 화면 아래 한 화면 높이 안의 구간 (가까운 순)
  above: number[] // 화면 위 한 화면 높이 안의 구간 (가까운 순)
}

interface PageRect {
  pageIdx: number
  top: number // 스크롤 컨테이너 내용 기준 위치
  bottom: number
}

const EMPTY_VIEWPORT: ViewportPages = { visible: [], below: [], above: [] }

/**
 * 화면 위치로 구간을 나눈다. 위아래 범위는 각각 한 화면 높이.
 * `rects`는 문서 순서(위→아래)여야 한다.
 */
const getViewportPages = (
  rects: PageRect[],
  viewTop: number,
  viewBottom: number,
): ViewportPages => {
  const height = viewBottom - viewTop
  const result: ViewportPages = { visible: [], below: [], above: [] }

  rects.forEach(({ pageIdx, top, bottom }) => {
    if (bottom > viewTop && top < viewBottom) result.visible.push(pageIdx)
    else if (top >= viewBottom && top < viewBottom + height)
      result.below.push(pageIdx)
    else if (bottom <= viewTop && bottom > viewTop - height)
      result.above.push(pageIdx)
  })
  result.above.reverse()
  return result
}

/**
 * 멈춘 위치 기준 검사 순서: 보이는 구간 → 아래 구간(가까운 순) → 위 구간(가까운 순).
 * 범위 밖 구간도 같은 규칙으로 줄 세운다 ("남은 부분 모두 검사"용).
 */
const orderFromViewport = (viewport: ViewportPages, pageCount: number) => {
  const { visible } = viewport
  if (visible.length === 0) {
    // 아직 화면 정보가 없으면 문서 순서
    return Array.from({ length: pageCount }, (_, i) => i)
  }
  const first = Math.min(...visible)
  const last = Math.max(...visible)
  const below = Array.from(
    { length: Math.max(pageCount - last - 1, 0) },
    (_, i) => last + 1 + i,
  )
  const above = Array.from({ length: first }, (_, i) => first - 1 - i)
  return [...visible, ...below, ...above]
}

export {
  getViewportPages,
  orderFromViewport,
  EMPTY_VIEWPORT,
  type ViewportPages,
  type PageRect,
}
