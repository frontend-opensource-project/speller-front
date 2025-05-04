import { ClipboardEvent, Fragment, memo, ReactNode, useMemo } from 'react'

import {
  useSpeller,
  useSpellerRefs,
  applyTextMethodColor,
  CorrectInfo,
} from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'

const SpellingCorrectionText = memo(() => {
  const { correctRefs, scrollSection } = useSpellerRefs()
  const { response, correctInfo, handleUpdateCorrectInfo } = useSpeller()
  const { str: text } = response

  const parts = useMemo(() => {
    return renderCorrectionSegments({
      payload: correctInfo,
      options: {
        renderPreCorrectionSegment: ({ lastIndex, currentIndex, position }) => {
          return processText(
            text.slice(lastIndex, position.start),
            `text-${currentIndex}`,
          )
        },
        renderCorrectionTargetSegment: ({
          currentIndex,
          position,
          isResolved,
          recommendedWord,
        }) => {
          const key = `correction-${currentIndex}`

          // 상단에 추천 단어를 표시하고 원본 텍스트에 밑줄 표시
          return (
            <span
              key={key}
              className={cn(
                'relative inline-block pt-6 transition-all duration-300',
                isResolved && 'pt-0',
              )}
              ref={correctRefs?.[currentIndex]}
              onMouseOver={() => scrollSection('error', currentIndex)}
              aria-label={`추천 단어 - ${recommendedWord}`}
            >
              <button
                className={cn(
                  'select-none',
                  'absolute left-0 top-0 h-6 whitespace-nowrap text-[1rem] font-bold leading-[170%] tracking-[-0.02rem] text-slate-600 opacity-100 transition-all duration-300',
                  isResolved && '-z-10 opacity-0',
                )}
                onClick={() => {
                  handleUpdateCorrectInfo({
                    ...position,
                    crtStr: recommendedWord,
                  })
                }}
              >
                {/* 첫 번째 추천 교정 단어 */}
                {recommendedWord}
              </button>
              <span
                className={cn(
                  'text-[1.125rem] font-bold leading-[160%] tracking-[-0.0225rem] underline decoration-[2px] underline-offset-[25%] tab:leading-[170%] tab:tracking-[-0.03375rem] pc:text-[1.25rem] pc:tracking-[-0.025rem]',
                  `${applyTextMethodColor(position.correctMethod)}`,
                  isResolved && 'text-slate-600',
                )}
              >
                {processText(position.crtStr ?? position.orgStr, key)}
              </span>
            </span>
          )
        },
        renderLastSegment: lastIndex => {
          if (lastIndex > text.length) return null
          const key = 'final'

          return (
            <span key={key}>{processText(text.slice(lastIndex), key)}</span>
          )
        },
      },
    })
  }, [correctInfo, response.str])

  return (
    <div
      className='h-0 w-full'
      onCopy={e => handleCopyWithExclusion(e, '.select-none')}
    >
      <section>
        <span className='select-text whitespace-pre-wrap break-all text-[1.125rem] leading-[160%] tracking-[-0.0225rem] [text-justify:distribute] tab:leading-[170%] tab:tracking-[-0.03375rem] pc:text-[1.25rem] pc:tracking-[-0.025rem]'>
          {parts}
        </span>
      </section>
    </div>
  )
})

SpellingCorrectionText.displayName = 'SpellingCorrectionText'

type RenderCorrectionSegmentsHandler = (data: {
  lastIndex: number
  currentIndex: number
  position: CorrectInfo
  isResolved: boolean
  recommendedWord: string
}) => ReactNode

type RenderCorrectionSegmentsOptions = {
  /** 각 교정 항목 앞에 위치한 일반 텍스트 렌더링 */
  renderPreCorrectionSegment: RenderCorrectionSegmentsHandler
  /** 교정 대상 텍스트를 추천 단어와 함께 렌더링 */
  renderCorrectionTargetSegment: RenderCorrectionSegmentsHandler
  /** 모든 교정 항목 이후에 남아 있는 일반 텍스트 렌더링 */
  renderLastSegment: (lastIndex: number) => ReactNode | null
}

type RenderCorrectionSegments = (args: {
  payload: Record<number, CorrectInfo>
  options: RenderCorrectionSegmentsOptions
}) => ReactNode[]

const renderCorrectionSegments: RenderCorrectionSegments = ({
  options,
  payload,
}) => {
  let lastIndex = 0 // useRef 대신 일반 변수 사용 - 매 렌더링마다 초기화 필요
  const parts: React.ReactNode[] = []

  Object.values(payload).forEach((pos, idx) => {
    const data: Parameters<RenderCorrectionSegmentsHandler>[0] = {
      lastIndex,
      currentIndex: idx,
      position: pos,
      isResolved: !!pos.crtStr,
      recommendedWord: pos.candWord.split('|')[0],
    }

    // 각 교정 항목 앞에 위치한 일반 텍스트 렌더링
    if (pos.start > lastIndex) {
      parts.push(options.renderPreCorrectionSegment(data))
    }

    // 교정 대상 텍스트를 추천 단어와 함께 렌더링
    parts.push(options.renderCorrectionTargetSegment(data))
    lastIndex = pos.end
  })

  // 모든 교정 항목 이후에 남아 있는 일반 텍스트 렌더링
  parts.push(options.renderLastSegment(lastIndex))

  return parts
}

// 줄바꿈 문자를 포함한 텍스트를 처리하는 함수
const processText = (textPart: string, key?: string) => {
  return textPart.split(/\r\n|\n\r|\n|\r/).map((line, idx, arr) => (
    <Fragment key={`${key}-${idx}`}>
      {line}
      {idx < arr.length - 1 ? <br /> : null}
    </Fragment>
  ))
}

// 클립보드 복사 시 특정 셀렉터가 적용된 요소의 텍스트를 제외하는 핸들러
const handleCopyWithExclusion = (e: ClipboardEvent, selectors: string) => {
  const selection = window.getSelection()

  if (selection) {
    const range = selection.getRangeAt(0)
    const clonedContent = range.cloneContents()

    clonedContent.querySelectorAll(selectors).forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    })

    if (clonedContent.textContent) {
      e.clipboardData.setData('text/plain', clonedContent.textContent)
      e.preventDefault()
    }
  }
}

export { SpellingCorrectionText }
