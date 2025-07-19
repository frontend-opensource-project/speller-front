export const getWordsAroundIndex = (
  text: string,
  startIndex: number,
  wordCount: number = 4,
) => {
  // 모든 단어 전부 매칭
  const wordRegex = /\S+/g
  const matches = [...text.matchAll(wordRegex)]

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const word = match[0]
    const wordStart = match.index!
    const wordEnd = wordStart + word.length

    // 주어진 startIndex가 단어 범위 내에 있는지 확인
    if (wordStart <= startIndex && startIndex < wordEnd) {
      // 앞쪽 단어들 가져오기
      const prevWords = matches
        .slice(Math.max(0, i - wordCount), i)
        .map(m => m[0])

      // 뒤쪽 단어들 가져오기
      const nextWords = matches.slice(i + 1, i + 1 + wordCount).map(m => m[0])

      // 초기 결과 생성 (원본 단어 포함)
      let result =
        `${prevWords.join(' ')} ${word} ${nextWords.join(' ')}`.trim()

      // 200자 초과 시 단어 단위로 축소
      if (result.length > 200) {
        let beforeWordCount = prevWords.length
        let afterWordCount = nextWords.length

        while (true) {
          const newPrevWords = prevWords.slice(-beforeWordCount)
          const newNextWords = nextWords.slice(0, afterWordCount)
          const newResult =
            `${newPrevWords.join(' ')} ${word} ${newNextWords.join(' ')}`.trim()

          if (newResult.length <= 200) {
            result = newResult
            break
          }

          // 뒤쪽 단어를 먼저 줄이고, 그 다음 앞쪽 단어를 줄임
          if (afterWordCount > 0) {
            afterWordCount--
          } else if (beforeWordCount > 0) {
            beforeWordCount--
          } else {
            // 더 이상 줄일 수 없으면 핵심 부분만 반환
            result = word
            break
          }
        }
      }

      return result
    }
  }

  throw new Error('Invalid index')
}
