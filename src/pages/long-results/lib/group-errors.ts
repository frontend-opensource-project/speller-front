import {
  errorKey,
  parseCandidateWords,
  type CorrectInfo,
  type LongCheckState,
} from '@/entities/speller'

interface ErrorGroupItem {
  key: string // `${pageIdx}:${errorIdx}`
  pageIdx: number
  info: CorrectInfo
}

interface ErrorGroup {
  key: string // 묶음 키
  orgStr: string
  firstCandidate: string // 1순위 대치어 (없으면 빈 문자열)
  correctMethod: number
  items: ErrorGroupItem[] // 문서 순서
  remaining: number // 수정도 무시도 하지 않은 개수
}

type ErrorGroupSort = 'document' | 'count'

// 문맥 오류는 위치마다 다른 대치어를 제안할 수 있어, 대치어와 유형까지 같아야 같은 묶음으로 본다
const groupKey = (info: CorrectInfo) =>
  JSON.stringify([
    info.orgStr,
    parseCandidateWords(info.candWord)[0]?.word ?? '',
    info.correctMethod,
  ])

const isProcessed = (
  state: Pick<LongCheckState, 'ignored'>,
  item: ErrorGroupItem,
) => item.info.crtStr !== undefined || !!state.ignored[item.key]

/**
 * 검사를 마친 구간의 오류를 묶는다.
 * 묶음 순서는 처음 나온 위치 기준(문서 순서) 또는 발생 횟수순(같으면 문서 순서).
 */
const groupErrors = (
  state: Pick<LongCheckState, 'pages' | 'ignored'>,
  sort: ErrorGroupSort = 'document',
): ErrorGroup[] => {
  const groups = new Map<string, ErrorGroup>()

  state.pages.forEach((page, pageIdx) => {
    if (page.status !== 'done') return
    const sorted = [...page.errInfo].sort((a, b) => a.start - b.start)
    sorted.forEach(info => {
      const key = groupKey(info)
      let group = groups.get(key)
      if (!group) {
        group = {
          key,
          orgStr: info.orgStr,
          firstCandidate: parseCandidateWords(info.candWord)[0]?.word ?? '',
          correctMethod: info.correctMethod,
          items: [],
          remaining: 0,
        }
        groups.set(key, group)
      }
      const item = { key: errorKey(pageIdx, info.errorIdx), pageIdx, info }
      group.items.push(item)
      if (!isProcessed(state, item)) group.remaining++
    })
  })

  // Map은 넣은 순서를 지키므로 그대로 문서 순서다
  const list = [...groups.values()]
  if (sort === 'count') {
    // Array.prototype.sort는 안정 정렬이라 횟수가 같으면 문서 순서가 유지된다
    list.sort((a, b) => b.items.length - a.items.length)
  }
  return list
}

export {
  groupErrors,
  isProcessed,
  type ErrorGroup,
  type ErrorGroupItem,
  type ErrorGroupSort,
}
