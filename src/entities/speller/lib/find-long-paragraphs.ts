import type { PageRange } from './split-pages'

// 서버는 줄 중간에서 자르지 않으므로 개행 없이 이어진 문단은 길이와 상관없이 한 번에 검사한다.
// 검사 서버의 실행 제한(20초)에 걸리지 않도록 이보다 긴 문단은 검사 전에 알린다
const LONG_PARAGRAPH_LIMIT = 10000

// 길이가 기준을 넘는 문단('\n'으로 나눈 줄)의 위치. 원문 순서대로
const findLongParagraphs = (text: string): PageRange[] => {
  const paragraphs: PageRange[] = []
  let start = 0
  while (start <= text.length) {
    const nl = text.indexOf('\n', start)
    const end = nl === -1 ? text.length : nl
    if (end - start > LONG_PARAGRAPH_LIMIT) paragraphs.push({ start, end })
    if (nl === -1) break
    start = nl + 1
  }
  return paragraphs
}

export { findLongParagraphs, LONG_PARAGRAPH_LIMIT }
