// 개행 문자 정규화 함수
const normalizeLineBreaks = (text: string): string => {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

export { normalizeLineBreaks }
