import { useRef } from 'react'
import { UAParser } from 'ua-parser-js'
import { useIOSKeyboardPatch } from '@/shared/lib/use-ios-keyboard-patch'

export const useInputWithIOSPatch = <
  T extends HTMLInputElement | HTMLTextAreaElement,
>() => {
  const inputRef = useRef<T>(null)
  const { os } = UAParser(window.navigator.userAgent)
  const isIOS = os.name === 'iOS'

  useIOSKeyboardPatch(inputRef, isIOS)

  return inputRef
}
