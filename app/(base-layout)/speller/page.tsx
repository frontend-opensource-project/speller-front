import { SpellerPage } from '@/pages/speller'
import type { Metadata } from 'next'

// 이 페이지의 Metadata 객체
export const metadata: Metadata = {
  title: '바른한글(구 한국어 맞춤법/문법 검사기)',
  description:
    "한국어 맞춤법과 문법을 자동으로 검사하여 오류를 감지하고 이를 바른 표현으로 교정해 주는 무료 온라인 도구입니다. 띄어쓰기, 맞춤법, 문장 구조를 분석하여 정확하고 자연스러운 한국어 작성을 도와드립니다. 바른한글(구 한국어 맞춤법/문법 검사기, 부산대 맞춤법/문법 검사기)는 권혁철 부산대 정보컴퓨터공학부 교수가 1994년부터 일반에 무료로 제공 중인 검사기로 오류 검색과 교정의 정확도가 매우 높다는 평가를 받아왔습니다. 한 달 평균 검사량이 1,000만 건이 넘을 정도로 인기가 있으며, 올바른 자기소개서를 작성하고 싶은 입시생이나 취업준비생에게 ‘등불’이라고 불려왔습니다. 권혁철 교수는 퇴임 후에도 ㈜나라인포테크에서 한국어처리 분야의 연구와 개발을 활발히 이어가고 있습니다. 퇴임 전과 후에 중요한 변화가 있었는데, 맞춤법/문법 검사 서비스의 온라인 사이트를 부산대학교 내부(speller.cs.pusan.ac.kr)에서 운영할 수 없게 됨에 따라, 외부(nara-speller.co.kr)로 이전하게 되었습니다. 또한, 서비스 화면의 디자인도 대폭 개편하게 되었고, 차제에 그동안 ‘한국어 맞춤법/문법 검사기’, 또는 ‘부산대 맞춤법/문법 검사기’로 불렸던 검사기를 ‘바른한글’이라는 간결한 명칭으로 상표 및 로고 등록 중입니다.",

  keywords: [
    '맞춤법',
    '문법',
    '문서교정',
    '교열',
    '한국어',
    '부산대학교',
    '나라인포테크',
    '무료',
    '글쓰기',
    '띄어쓰기',
    '오타교정',
    '순화용어',
    '한국어 문법',
    '한국어 글쓰기',
    '자기소개서',
    '한국어 교육',
    '한글',
    '한국어 학습',
    'Korean as Second Language',
    'Korean speller',
    'spell checker',
    'spell error correction',
    'grammar checker',
    'grammar error correction',
  ],

  alternates: {
    canonical: 'https://nara-speller.co.kr/speller',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default SpellerPage
