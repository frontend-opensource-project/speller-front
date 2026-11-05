import type { ErrorInfo } from '../model/speller-schema'

// 서버의 start/end는 UTF-16 단위이고, 서식 문자(\p{Cf}: ZWSP·BOM·소프트 하이픈 등)는 세지 않는다.
// (검사 속도 개선 전 서버는 코드 포인트 단위였다)
const FORMAT_CHAR = /\p{Cf}/u

// index: 서버 위치, value: 그 UTF-16 단위의 시작 · 끝 위치
const buildServerToUtf16Map = (text: string) => {
  const starts: number[] = []
  const ends: number[] = []
  let i = 0
  for (const ch of text) {
    if (!FORMAT_CHAR.test(ch)) {
      for (let j = 0; j < ch.length; j++) {
        starts.push(i + j)
        ends.push(i + j + 1)
      }
    }
    i += ch.length
  }
  return { starts, ends, length: i }
}

// 서버는 처리하지 않는 문자(이모지, 결합 문자 등)를 UTF-16 단위마다 공백으로 바꿔 orgStr에 담는다.
// 그래서 같은 글자이거나, orgStr 쪽이 공백이면 일치로 본다.
const matchesOrgStr = (slice: string, orgStr: string) => {
  const visible = slice.replace(new RegExp(FORMAT_CHAR, 'gu'), '')
  if (visible.length !== orgStr.length) return false
  for (let i = 0; i < visible.length; i++) {
    if (visible[i] !== orgStr[i] && orgStr[i] !== ' ') return false
  }
  return true
}

/**
 * 서버 좌표를 `text`(응답의 str) 기준 UTF-16 좌표로 바꾼다.
 * 바꾼 위치가 orgStr과 맞지 않는 오류는 `invalid`로 따로 돌려준다.
 */
const toUtf16ErrInfo = (
  text: string,
  errInfo: ErrorInfo[],
): { errInfo: ErrorInfo[]; invalid: ErrorInfo[] } => {
  const { starts, ends, length } = buildServerToUtf16Map(text)
  // 끝 위치는 마지막 글자의 끝으로 잡아, 뒤따르는 서식 문자가 오류 범위에 들어가지 않게 한다
  const toStart = (pos: number) =>
    pos === starts.length ? length : starts[pos]
  const toEnd = (pos: number) => (pos === 0 ? 0 : ends[pos - 1])
  const valid: ErrorInfo[] = []
  const invalid: ErrorInfo[] = []

  for (const info of errInfo) {
    const start = toStart(info.start)
    const end = info.end === info.start ? start : toEnd(info.end)
    if (
      start === undefined ||
      end === undefined ||
      start > end ||
      !matchesOrgStr(text.slice(start, end), info.orgStr)
    ) {
      invalid.push(info)
      continue
    }
    valid.push({ ...info, start, end })
  }

  return { errInfo: valid, invalid }
}

export { toUtf16ErrInfo }
