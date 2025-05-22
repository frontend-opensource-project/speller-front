import { useEffect, useState } from 'react'

const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [screenHeight, setScreenHeight] = useState(
    () => window.visualViewport?.height ?? window.innerHeight,
  )

  useEffect(() => {
    const visual = window.visualViewport
    if (!visual) return

    const handleResize = () => {
      const heightDiff = screenHeight - visual.height
      const isKeyboardOpen = heightDiff > 50

      setKeyboardHeight(isKeyboardOpen ? heightDiff : 0)

      requestAnimationFrame(() => {
        const nextHeight =
          visual.height > screenHeight ? screenHeight : visual.height
        setScreenHeight(nextHeight)
      })
    }

    const handleFocusOut = () => {
      requestAnimationFrame(() => {
        setScreenHeight(window.visualViewport?.height ?? window.innerHeight)
      })
    }

    visual.addEventListener('resize', handleResize)
    window.addEventListener('focusout', handleFocusOut)
    window.addEventListener('orientationchange', () => {
      setScreenHeight(window.innerHeight)
      setKeyboardHeight(0)
    })

    return () => {
      visual.removeEventListener('resize', handleResize)
      window.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  const forceUpdateScreenHeight = () => {
    setScreenHeight(window.visualViewport?.height ?? window.innerHeight)
  }

  return { keyboardHeight, screenHeight, forceUpdateScreenHeight }
}

export { useKeyboardHeight }
