/** 사이트 공식 명칭. 모든 페이지 title의 접미사로 사용된다. */
export const SITE_NAME = '바른한글(구 한국어 맞춤법/문법 검사기)'

/**
 * 검색 결과의 '사이트 이름'으로 노출하려는 짧은 명칭.
 * 구글은 title 대신 이 이름을 별도로 표시한다.
 */
export const SITE_SHORT_NAME = '바른한글'

/** 과거에 불리던 명칭들. 구글에 동일 사이트임을 알려주는 용도. */
export const SITE_ALTERNATE_NAMES = [
  '한국어 맞춤법/문법 검사기',
  '한국어 맞춤법 검사기',
  '부산대 맞춤법/문법 검사기',
  '부산대 맞춤법 검사기',
  'Korean Speller',
]

/** 사이트 대표 URL (마지막 슬래시 없음) */
export const SITE_URL = 'https://nara-speller.co.kr'

/** 하위 페이지 title 템플릿. 예) `소개 - 바른한글(구 한국어 맞춤법/문법 검사기)` */
export const TITLE_TEMPLATE = `%s - ${SITE_NAME}`

/** 검색 결과에 노출되는 기본 설명. 구글이 보여주는 길이에 맞춰 짧게 유지한다. */
export const SITE_DESCRIPTION =
  '한국어 맞춤법과 문법을 무료로 검사하고 교정합니다. 띄어쓰기와 문장 구조까지 분석해 자연스러운 글로 다듬어 드립니다. 회원가입 없이 바로 사용하세요.'
