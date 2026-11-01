import type { ErrorInfo } from '../model/speller-schema'

export function extractContext(
  str: string,
  errInfo: ErrorInfo,
  replaceWord: string,
  wordCount: number = 4,
) {
  const beforeWords = str
    .slice(Math.max(errInfo.start - wordCount * 10, 0), errInfo.start)
    .split(/\s+/)
    .filter(Boolean)
  const afterWords = str
    .slice(errInfo.end, Math.min(errInfo.end + wordCount * 10, str.length - 1))
    .split(/\s+/)
    .filter(Boolean)

  return `${beforeWords.slice(-wordCount).join(' ')} ${replaceWord} ${afterWords.slice(0, wordCount).join(' ')}`
}
