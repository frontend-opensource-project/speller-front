import type { NoticeDetail } from '../model/notice.schema'

/** 목록 요약으로 쓸 최대 길이. 넘으면 말줄임표를 붙인다. */
const MAX_LENGTH = 120

/**
 * 마크다운 문법을 걷어내 목록에 쓸 평문을 만든다.
 * 완전한 파서가 아니라, 공지 본문에서 쓰는 표기만 다룬다.
 */
const toPlainText = (markdown: string) =>
  markdown
    // 링크/이미지는 표시 텍스트만 남긴다.
    .replace(/!?\[\[?([^\]]*?)\]?\]\([^)]*\)/g, '$1')
    // 강조, 인라인 코드 기호를 지운다.
    .replace(/[*_`~]/g, '')
    // 머리글, 인용, 목록 기호를 지운다.
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * 공지 목록에 보여 줄 요약문.
 * JSON 에 `summary` 가 있으면 그대로 쓰고, 없으면 본문 앞부분으로 만든다.
 */
export function summarizeNotice(notice: NoticeDetail): string {
  if (notice.summary) return notice.summary

  // 구분선 앞까지가 도입부인 경우가 많아, 본문 전체 대신 첫 단락들만 본다.
  const intro = notice.body.split(/^\s*---\s*$/m)[0] ?? notice.body
  const plain = toPlainText(intro)

  return plain.length > MAX_LENGTH
    ? `${plain.slice(0, MAX_LENGTH).trimEnd()}…`
    : plain
}
