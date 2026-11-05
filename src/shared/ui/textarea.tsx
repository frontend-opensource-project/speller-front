'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'

import { ScrollContainer, ScrollContainerHandle } from './scroll-container'
import { cn } from '../lib/tailwind-merge'

export interface TextareaHandle {
  textClear: () => void
  hydrateText: (payload: string) => void
  focus: () => void
  focusAt: (position: number) => void // 커서를 position에 두고 그 줄이 보이게 스크롤
}

interface TextareaProps {
  placeholder: string
  onChange: (value: string) => void
  name?: string
  className?: React.HTMLAttributes<HTMLDivElement>['className']
  onScroll?: (isScrolling: boolean) => void
}

// 입력창 안에서 position 글자가 놓이는 줄의 위쪽 위치(px).
// 같은 글꼴 · 폭으로 글을 그린 숨은 div에서 잰다
const MIRRORED_STYLES = [
  'boxSizing',
  'width',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'whiteSpace',
  'wordBreak',
  'overflowWrap',
] as const

const measureCaretTop = (textarea: HTMLTextAreaElement, position: number) => {
  const style = getComputedStyle(textarea)
  const mirror = document.createElement('div')
  MIRRORED_STYLES.forEach(prop => {
    mirror.style[prop] = style[prop]
  })
  mirror.style.position = 'absolute'
  mirror.style.visibility = 'hidden'
  mirror.style.top = '0'
  mirror.style.left = '-9999px'
  mirror.textContent = textarea.value.slice(0, position)
  const marker = document.createElement('span')
  marker.textContent = '\u200b'
  mirror.appendChild(marker)
  document.body.appendChild(mirror)
  const top = marker.offsetTop
  mirror.remove()
  return top
}

const Textarea = forwardRef<TextareaHandle, TextareaProps>(
  ({ className, onScroll, onChange, placeholder, name }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const scrollRef = useRef<ScrollContainerHandle>(null)

    const syncTextareaHeight = () => {
      const textarea = textareaRef.current

      if (!textarea) return

      textarea.style.height = '100%'

      if (textarea.value.length > 0) {
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }

    const setTextareaValue = (value: string) => {
      if (!textareaRef.current) return

      textareaRef.current.value = value
    }

    useImperativeHandle(
      ref,
      () => ({
        textClear: () => {
          if (!textareaRef.current) return

          onChange('')
          setTextareaValue('')
          syncTextareaHeight()
        },
        hydrateText: payload => {
          setTextareaValue(payload)
          syncTextareaHeight()
        },
        focus: () => {
          if (!textareaRef.current) return

          const textarea = textareaRef.current
          textarea.focus()

          // 커서를 텍스트 맨 끝으로 이동
          const length = textarea.value.length
          textarea.setSelectionRange(length, length)
        },
        focusAt: position => {
          const textarea = textareaRef.current
          if (!textarea) return

          // 입력창은 글 높이만큼 늘어나고 바깥 스크롤 영역이 움직이므로 직접 스크롤한다
          textarea.focus({ preventScroll: true })
          textarea.setSelectionRange(position, position)
          const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight)
          scrollRef.current?.scrollTo({
            top: Math.max(0, measureCaretTop(textarea, position) - lineHeight),
            behavior: 'smooth',
          })
        },
      }),
      [onChange],
    )

    return (
      <div className='relative h-full'>
        <ScrollContainer
          ref={scrollRef}
          onScrollStatusChange={onScroll}
          className='absolute inset-0 overflow-hidden'
        >
          <textarea
            ref={textareaRef}
            name={name}
            style={{ height: '100%' }}
            placeholder={placeholder}
            className={cn(
              'flex h-full w-full resize-none overflow-hidden whitespace-pre-wrap break-all border-none border-input text-justify align-top text-[1.125rem] text-base font-normal leading-7 tracking-[-0.0225rem] text-slate-600 ring-offset-background placeholder:text-muted-foreground placeholder:text-slate-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-text dark:placeholder:text-dark-border pc:text-[1.25rem] pc:leading-8 pc:tracking-[-0.025rem]',
              className,
            )}
            onInput={({ currentTarget: { value } }) => {
              onChange(value)
              syncTextareaHeight()
            }}
          />
        </ScrollContainer>
      </div>
    )
  },
)

Textarea.displayName = 'CustomScrollTextarea'

export { Textarea }
