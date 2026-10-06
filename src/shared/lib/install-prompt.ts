import { useSyncExternalStore } from 'react'

import { INSTALL_PROMPT_CHANGE_EVENT as CHANGE_EVENT } from './install-prompt-script'

/** Chromium 계열 브라우저의 설치 이벤트. 표준 lib.dom 타입에는 없다. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

declare global {
  interface Window {
    __installPrompt?: BeforeInstallPromptEvent | null
  }
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CHANGE_EVENT, onChange)
}

/** 붙잡아 둔 설치 이벤트. 설치할 수 없거나 이미 쓴 경우 null. */
export const useInstallPrompt = () =>
  useSyncExternalStore(
    subscribe,
    () => window.__installPrompt ?? null,
    () => null,
  )

/** 설치 이벤트의 prompt() 는 한 번만 쓸 수 있으므로, 쓴 뒤에는 비운다. */
export const clearInstallPrompt = () => {
  window.__installPrompt = null
  window.dispatchEvent(new Event(CHANGE_EVENT))
}
