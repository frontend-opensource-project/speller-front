'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'longMode'

/** 긴글 모드 토글 상태. 다음 방문에도 유지되도록 localStorage에 기억한다 */
const useLongModePreference = () => {
  const [enabled, setEnabled] = useState(false)

  // 서버 렌더와 첫 렌더를 맞추기 위해 마운트 후에 읽는다
  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(STORAGE_KEY) === 'on')
    } catch {
      // 저장소를 쓸 수 없으면 꺼진 상태로 둔다
    }
  }, [])

  const update = useCallback((value: boolean) => {
    setEnabled(value)
    try {
      localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off')
    } catch {
      // 저장하지 못해도 이번 방문 동안은 바뀐 값으로 동작한다
    }
  }, [])

  return [enabled, update] as const
}

export { useLongModePreference }
