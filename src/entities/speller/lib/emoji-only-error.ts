import type { ErrorInfo } from '../model/speller-schema'
import { parseCandidateWords } from './parse-candidate-words'

// 이모지와 이모지를 이루는 문자 (ZWJ · 이체 선택자 · 피부색 · 국기 · 키캡 · 태그)
const EMOJI_PART =
  /\p{Extended_Pictographic}|\p{Emoji_Modifier}|\p{Regional_Indicator}|[‍︎️⃣]|[\u{E0020}-\u{E007F}]/gu

const normalizeSpaces = (text: string) => text.replace(/\s+/g, ' ').trim()

/**
 * 이모지 때문에만 생긴 오류인지 판단한다.
 * 서버는 이모지를 처리하지 못해 오류로 돌려주는데, 원문에서 이모지만 빼면
 * 1순위 대치어와 같아지는 경우(이모지만 있는 오류 포함)는 오류로 보지 않는다.
 * 띄어쓰기 교정은 그대로 남기도록 공백은 여러 칸을 한 칸으로만 맞춘다.
 */
const isEmojiOnlyError = (slice: string, info: ErrorInfo) => {
  if (!slice.match(EMOJI_PART)) return false
  const withoutEmoji = normalizeSpaces(slice.replace(EMOJI_PART, ''))
  const candidate = normalizeSpaces(
    parseCandidateWords(info.candWord)[0]?.word ?? '',
  )
  return withoutEmoji === candidate
}

export { isEmojiOnlyError }
