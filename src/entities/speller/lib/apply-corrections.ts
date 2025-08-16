import { CorrectInfo } from '../model/speller-schema'

export const applyCorrections = (
  originalText: string,
  correctInfo: Record<number, CorrectInfo>,
  offset = 0,
) => {
  let displayText = originalText

  Object.values(correctInfo).forEach(({ start, end, crtStr }) => {
    // 앞의 변경이 적용되었으므로 새로운 인덱스를 계산
    const adjustedStart = offset + start
    const adjustedEnd = offset + end

    if (!crtStr) return

    displayText =
      displayText.slice(0, adjustedStart) +
      crtStr +
      displayText.slice(adjustedEnd)

    // 문자열 길이 차이를 반영하여 offset 조정
    offset += crtStr.length - (end - start)
  })

  return displayText
}
