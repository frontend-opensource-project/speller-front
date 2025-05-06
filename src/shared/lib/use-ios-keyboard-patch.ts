import { RefObject, useCallback, useEffect } from 'react'

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
