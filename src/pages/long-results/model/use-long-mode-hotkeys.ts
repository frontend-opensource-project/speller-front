'use client'

import { useEffect, useRef } from 'react'

interface LongModeHotkeyHandlers {
  next: () => void
  prev: () => void
  correctFirst: () => void // Enter · 2
  ignore: () => void // 1
  ignoreGroup: () => void // 3
  correctGroup: () => void // 4
  editCustom: () => void // 5
  escape: () => void // 정보창이 닫혀 있을 때만 (열려 있으면 Radix가 닫는다)
  undo: () => void // Ctrl/⌘ + Z
  copyAll: () => void // Ctrl/⌘ + Shift + C
  help: () => void // ?
}

const isEditable = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.closest('input, textarea, select, [contenteditable="true"]') !== null
  )
}

// Enter는 버튼 · 링크에 포커스가 있으면 그 요소를 누르는 키로 둔다 (문서의 오류어는 예외)
const isNativeEnterTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  !target.hasAttribute('data-error-idx') &&
  target.closest('button, a[href], [role="button"]') !== null

const SINGLE_KEYS: Record<string, keyof LongModeHotkeyHandlers> = {
  ArrowRight: 'next',
  ArrowDown: 'next',
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  Enter: 'correctFirst',
  '2': 'correctFirst',
  '1': 'ignore',
  '3': 'ignoreGroup',
  '4': 'correctGroup',
  '5': 'editCustom',
  Escape: 'escape',
  '?': 'help',
}

type HotkeyEvent = Pick<
  KeyboardEvent,
  | 'key'
  | 'code'
  | 'keyCode'
  | 'ctrlKey'
  | 'metaKey'
  | 'altKey'
  | 'shiftKey'
  | 'isComposing'
  | 'defaultPrevented'
  | 'target'
>

/** 키 입력을 단축키 이름으로 바꾼다. 받지 않을 입력이면 null */
const resolveHotkey = (e: HotkeyEvent): keyof LongModeHotkeyHandlers | null => {
  if (e.defaultPrevented) return null
  if (e.isComposing || e.keyCode === 229) return null
  if (isEditable(e.target)) return null

  // 한글 자판이어도 같은 위치의 키로 보도록 code를 쓴다
  if ((e.ctrlKey || e.metaKey) && !e.altKey) {
    if (e.code === 'KeyZ' && !e.shiftKey) return 'undo'
    if (e.code === 'KeyC' && e.shiftKey) return 'copyAll'
    return null
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return null

  const name = SINGLE_KEYS[e.key]
  if (!name) return null
  // ?는 Shift와 함께 눌리므로 Shift를 허용하고, 나머지는 Shift가 없을 때만
  if (e.shiftKey && name !== 'help') return null
  if (e.key === 'Enter' && isNativeEnterTarget(e.target)) return null
  return name
}

/**
 * 긴글 모드 단축키 (계획서 §3.9).
 * 한글 조합 중이거나 입력 요소 안에서는 받지 않는다. `enabled`가 false면(도움말 등 대화상자가 열림) 모두 끈다.
 */
const useLongModeHotkeys = (
  handlers: LongModeHotkeyHandlers,
  enabled: boolean,
) => {
  // 매 렌더 새로 만든 핸들러를 쓰되 리스너는 다시 붙이지 않는다
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const name = resolveHotkey(e)
      if (!name) return
      e.preventDefault()
      handlersRef.current[name]()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled])
}

export { useLongModeHotkeys, resolveHotkey, type LongModeHotkeyHandlers }
