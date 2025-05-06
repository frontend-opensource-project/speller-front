import { RefObject, useCallback, useEffect } from 'react'

/**
 * iOS에서 input/textarea 외부를 터치해도 키보드가 자동으로 닫히지 않는 이슈를 우회하는 훅입니다.
 * 바깥 터치 시 강제로 blur → focus를 실행해 iOS의 키보드/포커스 상태를 리셋합니다.
 */
export const useIOSKeyboardPatch = (
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement>,
  shouldApply = false,
) => {
  const forceRefocus = useCallback(() => {
    const input = ref.current
    if (!shouldApply || !input) return

    input.blur()
    setTimeout(() => {
      input.focus()
    }, 100)
  }, [ref])

  useEffect(() => {
    const handleTouchOutside = (e: TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        forceRefocus()
      }
    }

    document.addEventListener('touchend', handleTouchOutside)
    return () => {
      document.removeEventListener('touchend', handleTouchOutside)
    }
  }, [forceRefocus])
}
