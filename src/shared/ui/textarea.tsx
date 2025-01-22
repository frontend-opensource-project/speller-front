'use client'

import { FC, useCallback, useEffect, useRef, useState } from 'react'

import { initCaretPositionPolyfill } from '@/shared/lib/caret-position.polyfill'
import { ScrollContainer } from './scroll-container'
import { useClient } from '../lib/use-client'
import { cn } from '../lib/tailwind-merge'

if (typeof window !== 'undefined') {
  initCaretPositionPolyfill()
}

interface TextareaProps {
  value: string
  placeholder: string
  onChange: (value: string) => void
  onScroll?: (isScrolling: boolean) => void
  className?: React.HTMLAttributes<HTMLDivElement>['className']
}

const Textarea: FC<TextareaProps> = ({
  onChange,
  value,
  placeholder,
  onScroll,
  className,
}) => {
  const isClient = useClient()
  const [isFocused, setIsFocused] = useState(false)
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
    const text = event.currentTarget.textContent || ''
    lastValueRef.current = text
    onChange(text)

    // 빈 텍스트일 때 <br> 태그 제거
    if (!text && event.currentTarget.innerHTML === '<br>') {
      event.currentTarget.innerHTML = ''
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

  // 공백 클릭 시 마지막 텍스트 포커스 처리되게 하는 로직
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const element = contentEditableRef.current

    // 클릭된 위치의 정확한 노드 확인
    const range = document.caretPositionFromPoint?.(
      event.clientX,
      event.clientY,
    )

    if (!range || !element) return

    const isDivNode = range.offsetNode.nodeType === Node.ELEMENT_NODE

    if (isDivNode && element.textContent) {
      // 스크롤 이동 없이 포커스 설정
      element.focus({ preventScroll: true })

      // 현재 선택 영역 정보 가져오기
      const selection = window.getSelection()
      // 새로운 범위 객체 생성
      const newRange = document.createRange()
      // 마지막 텍스트 노드 선택
      const lastChild = element.lastChild || element

      // 해당 노드의 컨텐츠를 선택 범위로 지정
      newRange.selectNodeContents(lastChild)
      // 선택 범위를 끝점으로 접기 (커서를 끝으로 이동)
      newRange.collapse(false)
      // 기존 선택 영역 모두 제거
      selection?.removeAllRanges()
      // 새로운 선택 영역 추가 (커서 위치 설정)
      selection?.addRange(newRange)
    }

    setIsFocused(true)
  }, [])

  // 공백 클릭 시 드래그 가능하게 처리하는 로직
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!(event.buttons === 1)) return

      const element = contentEditableRef.current
      const range = document.caretPositionFromPoint?.(
        event.clientX,
        event.clientY,
      )

      if (!range || !element) return

      const isDivNode = range.offsetNode.nodeType === Node.ELEMENT_NODE

      if (isDivNode) {
        const selection = window.getSelection()
        const newRange = document.createRange()
        const lastChild = element.lastChild || element

        // 시작점 설정
        newRange.setStart(lastChild, 0)
        newRange.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(newRange)
      }
    },
    [],
  )

  return (
    <ScrollContainer
      suppressHydrationWarning
      suppressContentEditableWarning
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      isFocused={isFocused}
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
      />
    </ScrollContainer>
  )
}
Textarea.displayName = 'Textarea'

export { Textarea }
