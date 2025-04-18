export const getWordsAroundIndex = (text: string, startIndex: number) => {
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
      const prevWord = matches[i - 1]?.[0] || ''
      const nextWord = matches[i + 1]?.[0] || ''
      return `${prevWord} ${word} ${nextWord}`
    }
  }

  throw new Error('Invalid index')
}
