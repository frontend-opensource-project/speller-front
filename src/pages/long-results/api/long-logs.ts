import {
  SpellerApi,
  extractContext,
  parseCandidateWords,
  type CorrectInfo,
} from '@/entities/speller'
import { ReportApi } from '@/entities/report'
import { getWordsAroundIndex } from '@/shared/lib/util'

// 긴글 모드의 로그는 브라우저에서 바로 /api로 보낸다.
// 서버 액션은 현재 페이지(/results/long)로 POST하므로 /results/* 속도 제한에 걸린다.
// 로그 실패는 교정 동작을 막지 않는다.
const fireAndForget = (request: () => Promise<unknown>) => {
  request().catch(error => console.error(error))
}

const firstCandidate = (info: CorrectInfo) =>
  parseCandidateWords(info.candWord)[0]?.word ?? ''

// 1순위가 아닌 대치어를 골랐을 때
const logClickReplace = (
  pageText: string,
  info: CorrectInfo,
  replaceWord: string,
) =>
  fireAndForget(() =>
    SpellerApi.logClickReplace({
      errorWord: info.orgStr,
      replaceWord,
      sentence: extractContext(pageText, info, replaceWord),
      wordList: info.candWord,
    }),
  )

const logUserReplace = (
  pageText: string,
  info: CorrectInfo,
  replaceWord: string,
) =>
  fireAndForget(() =>
    SpellerApi.logUserReplace({
      errorWord: info.orgStr,
      replaceWord,
      sentence: getWordsAroundIndex(pageText, info.start),
    }),
  )

// '무시' · '모두 무시'를 눌렀을 때만 보낸다 (복사할 때는 보내지 않음)
const logNotChange = (items: { pageText: string; info: CorrectInfo }[]) => {
  if (items.length === 0) return
  fireAndForget(() =>
    SpellerApi.notChange(
      items.map(({ pageText, info }) => ({
        errorWord: info.orgStr,
        replaceWord: firstCandidate(info),
        sentence: getWordsAroundIndex(pageText, info.start),
      })),
    ),
  )
}

const sendReport = (pageText: string, info: CorrectInfo, comment: string) =>
  ReportApi.sendReport({
    strTitle: comment,
    inputStr: getWordsAroundIndex(pageText, info.start),
    errorWord: info.orgStr,
    replaceWord: info.candWord.replaceAll('|', '<br>'),
    comment,
  })

export {
  firstCandidate,
  logClickReplace,
  logUserReplace,
  logNotChange,
  sendReport,
}
