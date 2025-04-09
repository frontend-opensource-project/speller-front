'use client'

import { FC, useEffect, useRef, useState } from 'react'

import { initCaretPositionPolyfill } from '@/shared/lib/caret-position.polyfill'
import { ScrollContainer } from './scroll-container'
import { useClient } from '../lib/use-client'
import { cn } from '../lib/tailwind-merge'
import { useDesktopOrFallback } from '../lib/use-desktop-or-fallback'

if (typeof window !== 'undefined') {
  initCaretPositionPolyfill()
}

interface TextareaProps {
  value: string
  placeholder: string
  name?: string
  className?: React.HTMLAttributes<HTMLDivElement>['className']
  onChange: (value: string) => void
  onScroll?: (isScrolling: boolean) => void
}

const Textarea: FC<TextareaProps> = ({
  onChange,
  value,
  placeholder,
  onScroll,
  name,
  className,
}) => {
  const isClient = useClient()
  const [isFocused, setIsFocused] = useState(false)
  const shouldShowFocusState = useDesktopOrFallback(true, isFocused)
  // 실제 편집 가능한 텍스트 영역 요소 참조
  const contentEditableRef = useRef<HTMLDivElement>(null)
  // 마지막으로 업데이트된 값을 저장 (불필요한 리렌더링 방지)
  const lastValueRef = useRef('')

  // value prop이 외부에서 변경될 때 동기화
  useEffect(() => {
    if (!isClient || !contentEditableRef.current) return

    if (value !== lastValueRef.current) {
      contentEditableRef.current.innerHTML = value
      lastValueRef.current = value
    }
  }, [isClient, value])

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    const content = event.currentTarget
    const text = convertHtmlToLineBreaks(content.innerHTML)

    lastValueRef.current = text
    onChange(text)

    // 빈 텍스트일 때 <br> 태그 제거
    if (!text && content.innerHTML === '<br>') {
      content.innerHTML = ''
    }
  }

  // 포커스 해제 시 처리
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(false)

    // 빈 텍스트일 때 정리
    if (
      !event.currentTarget.textContent &&
      event.currentTarget.innerHTML === '<br>'
    ) {
      event.currentTarget.innerHTML = ''
      lastValueRef.current = ''
      onChange('')
    }
  }

  // 붙여넣기 처리
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    const selection = window.getSelection()

    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
    }

    // 커서를 삽입된 텍스트 끝으로 이동
    if (contentEditableRef.current) {
      const newRange = document.createRange()
      const lastChild =
        contentEditableRef.current.lastChild || contentEditableRef.current
      newRange.selectNodeContents(lastChild)
      newRange.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(newRange)
    }

    // 상태 업데이트
    if (contentEditableRef.current) {
      const text = convertHtmlToLineBreaks(contentEditableRef.current.innerHTML)
      // 태그 소각
      const decodedText =
        new DOMParser().parseFromString(text, 'text/html').documentElement
          .textContent || ''

      lastValueRef.current = text
      onChange(text)

      // 빈 텍스트일 때 <br> 태그 제거
      if (!decodedText && contentEditableRef.current.innerHTML === '<br>') {
        contentEditableRef.current.innerHTML = ''
      }
    }
  }

  const convertHtmlToLineBreaks = (innerHTML: string) => {
    const text = innerHTML
      .replace(/<div><br><\/div>/g, '\n')
      .replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br>/g, '')
      .replace(/&nbsp;/g, ' ')

    return text
  }

  return (
    <ScrollContainer
      suppressHydrationWarning
      suppressContentEditableWarning
      isFocused={shouldShowFocusState}
      onScrollStatusChange={onScroll}
      className='h-full min-h-40 flex-1'
    >
      <div
        ref={contentEditableRef}
        data-placeholder={placeholder}
        className={cn(
          'h-0 min-h-full w-full whitespace-pre-wrap break-all text-justify text-[1.125rem] font-normal leading-[1.8rem] tracking-[-0.0225rem] text-slate-600 outline-none empty:before:text-slate-300 empty:before:content-[attr(data-placeholder)] tab:leading-[1.9125rem] pc:text-[1.25rem] pc:leading-[2.125rem] pc:tracking-[-0.025rem]',
          className,
        )}
        contentEditable
        suppressContentEditableWarning
        suppressHydrationWarning
        onFocus={() => setIsFocused(true)}
        onInput={handleInput}
        onBlur={handleBlur}
        onPaste={handlePaste}
      />
      <input type='hidden' name={name} value={value} />
    </ScrollContainer>
  )
}
Textarea.displayName = 'Textarea'

export { Textarea }
