/**
 * 이름의 첫글자와 끝글자만 표시하고 중간은 *로 마스킹합니다.
 * 예: "홍길동" → "홍*동", "김철수" → "김*수", "이" → "이", "AB" → "A*B"
 */
export function maskName(name: string): string {
  if (!name) return name

  const trimmed = name.trim()
  const length = trimmed.length

  if (length <= 1) {
    return trimmed
  }

  if (length === 2) {
    return trimmed[0] + '*'
  }

  const first = trimmed[0]
  const last = trimmed[length - 1]
  const middle = '*'.repeat(length - 2)

  return first + middle + last
}
