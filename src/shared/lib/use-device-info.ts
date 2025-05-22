import { UAParser } from 'ua-parser-js'
import { useKeyboardHeight } from './use-keyboard-height'

interface DialogDeviceInfo {
  device: UAParser.IDevice
  browser: UAParser.IBrowser
  os: UAParser.IOS
  screenHeight: number
  contentHeight: number
  adjustedPadding: number
  isKeyboardOpen: boolean
  forceUpdateScreenHeight: () => void
}

export function useDialogDeviceInfo(
  contentRef: React.RefObject<HTMLDivElement>,
): DialogDeviceInfo {
  const parser = new UAParser(window.navigator.userAgent)
  // 디바이스 정보 파싱
  const { device, browser, os } = parser.getResult()
  // 키보드 높이 관련 상태
  const { keyboardHeight, screenHeight, forceUpdateScreenHeight } =
    useKeyboardHeight()
  // 콘텐츠 높이 계산
  const contentHeight = contentRef.current?.offsetHeight ?? 0

  // 삼성 브라우저일 경우 툴바 보정
  const isSamsung = browser.name === 'Samsung Internet'
  const toolbarBuffer = isSamsung ? 48 : 0
  const adjustedKeyboardHeight = keyboardHeight + toolbarBuffer
  const isKeyboardOpen = adjustedKeyboardHeight > 0

  // 브라우저/OS 조건 체크
  const isIOS = os.name === 'iOS'
  const isMobileChrome = browser.name === 'Chrome' && device.type === 'mobile'

  // 모바일 Chrome에서는 화면보다 콘텐츠가 커야 키보드 패딩을 줄 필요가 있음
  const shouldApplySimpleOffset = isMobileChrome
    ? screenHeight >= contentHeight
    : screenHeight > contentHeight

  // 키보드가 열렸을 때 하단 여백 보정값 계산
  const getAdjustedPadding = () => {
    if (!isKeyboardOpen) return 0

    const remainingSpace = screenHeight - contentHeight

    if (isIOS) {
      const overflow = screenHeight + contentHeight - screenHeight
      const overflowCorrection = Math.max(0, overflow)
      return adjustedKeyboardHeight - overflowCorrection - remainingSpace
    }

    if (shouldApplySimpleOffset) {
      return adjustedKeyboardHeight
    }

    const overflow = screenHeight + contentHeight - window.innerHeight
    const overflowCorrection = Math.max(0, overflow)
    return adjustedKeyboardHeight - overflowCorrection - remainingSpace
  }

  const adjustedPadding = getAdjustedPadding()

  return {
    device,
    browser,
    os,
    screenHeight,
    contentHeight,
    adjustedPadding,
    isKeyboardOpen,
    forceUpdateScreenHeight,
  }
}
