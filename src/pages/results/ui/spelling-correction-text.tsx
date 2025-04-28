import { Fragment } from 'react'
import {
  useSpeller,
  useSpellerRefs,
  CorrectMethodEnum,
} from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'

const SpellingCorrectionText = () => {
  const { correctRefs, scrollSection } = useSpellerRefs()
  const { response, correctInfo, handleUpdateCorrectInfo } = useSpeller()
  const { str: text } = response

  let lastIndex = 0 // useRef 대신 일반 변수 사용 - 매 렌더링마다 초기화 필요
  const parts: React.ReactNode[] = []

  // 줄바꿈 문자를 포함한 텍스트를 처리하는 함수
  const processText = (textPart: string) => {
    return textPart.split(/\r\n|\n\r|\n|\r/).map((line, i, arr) => (
      <Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </Fragment>
    ))
  }

  Object.values(correctInfo).forEach((pos, idx) => {
    const isResolved = !!pos.crtStr
    const recommendedWord = pos.candWord.split('|')[0]

    // 현재 교정 위치 이전의 일반 텍스트 처리
    if (pos.start > lastIndex) {
      parts.push(
        <span key={`text-${idx}`}>
          {processText(text.slice(lastIndex, pos.start))}
        </span>,
      )
    }

    // 교정이 필요한 텍스트 처리
    // 상단에 추천 단어를 표시하고 원본 텍스트에 밑줄 표시
    parts.push(
      <span
        key={`correction-${idx}`}
        className={cn(
          'relative inline-block pt-6 transition-all duration-300',
          isResolved && 'pt-0',
        )}
        ref={correctRefs?.[idx]}
        onMouseOver={() => scrollSection('error', idx)}
      >
        <button
          className={cn(
            'absolute left-0 top-0 h-6 leading-none opacity-100 transition-all duration-300',
            isResolved && '-z-10 opacity-0',
          )}
          onClick={() => {
            handleUpdateCorrectInfo({
              ...pos,
              crtStr: recommendedWord,
            })
          }}
        >
          <span className='whitespace-nowrap text-[1rem] font-bold leading-[170%] tracking-[-0.02rem] text-slate-600'>
            {/* 첫 번째 추천 교정 단어 */}
            {recommendedWord}
          </span>
        </button>
        <span
          className={cn(
            'text-[1.125rem] font-bold leading-[160%] tracking-[-0.0225rem] text-purple-100 underline decoration-[2px] underline-offset-[25%] tab:leading-[170%] tab:tracking-[-0.03375rem] pc:text-[1.25rem] pc:tracking-[-0.025rem]',
            pos.correctMethod === CorrectMethodEnum.enum.띄어쓰기 &&
              'text-purple-100',
            pos.correctMethod === CorrectMethodEnum.enum.오탈자 &&
              'text-red-100',
            pos.correctMethod === CorrectMethodEnum.enum.문맥 &&
              'text-green-100',
            isResolved && 'text-slate-600',
          )}
        >
          {processText(pos.crtStr ?? pos.orgStr)}
        </span>
      </span>,
    )

    lastIndex = pos.end
  })

  // 마지막 교정 위치 이후의 남은 텍스트 처리
  if (lastIndex < text.length) {
    parts.push(<span key='final'>{processText(text.slice(lastIndex))}</span>)
  }

  return (
    <div className='h-0 w-full whitespace-pre-wrap break-all text-[1.125rem] leading-[160%] tracking-[-0.0225rem] [text-justify:distribute] tab:leading-[170%] tab:tracking-[-0.03375rem] pc:text-[1.25rem] pc:tracking-[-0.025rem]'>
      {parts}
    </div>
  )
}

export { SpellingCorrectionText }
