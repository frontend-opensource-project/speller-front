const PAGE_THRESHOLD = 600

export interface PageRange {
  start: number // 원문 내 시작 위치 (UTF-16)
  end: number // 원문 내 끝 위치 (포함하지 않음)
}

// 서버의 페이지 분할 규칙 재현.
// 줄 끝('\n' 앞)까지의 구간 길이가 600을 넘으면 그 줄 끝에서 자른다.
// 자른 자리의 '\n'은 다음 구간의 첫 글자가 된다. 줄 중간에서는 자르지 않는다.
// 길이는 JS length(UTF-16, '\r'·서식 문자 포함) 그대로 센다.
const splitPages = (text: string): PageRange[] => {
  const pages: PageRange[] = []
  let pageStart = 0
  let pos = 0

  while (true) {
    const nl = text.indexOf('\n', pos)
    if (nl === -1) {
      pages.push({ start: pageStart, end: text.length })
      return pages
    }
    if (nl - pageStart > PAGE_THRESHOLD) {
      pages.push({ start: pageStart, end: nl })
      pageStart = nl
    }
    pos = nl + 1
  }
}

export { splitPages, PAGE_THRESHOLD }
