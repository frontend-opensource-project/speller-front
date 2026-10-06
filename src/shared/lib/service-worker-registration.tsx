'use client'

import { useEffect } from 'react'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

/**
 * 서비스 워커(public/sw.js)를 등록한다.
 *
 * @description
 * - 프로덕션 빌드에서만 등록한다. 개발 서버에서 등록하면 이후 새로고침에도 워커가 남아 디버깅을 방해한다.
 * - scope 를 basePath 로 지정해, 같은 도메인을 쓰는 스테이징과 운영의 워커가 서로 다른 범위를 갖게 한다.
 * - 첫 화면 로딩과 경쟁하지 않도록 load 이후에 등록한다.
 */
const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = () => {
      navigator.serviceWorker
        .register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` })
        .catch(error => {
          console.error('서비스 워커 등록에 실패했습니다.', error)
        })
    }

    if (document.readyState === 'complete') {
      register()
      return
    }

    window.addEventListener('load', register, { once: true })
    return () => window.removeEventListener('load', register)
  }, [])

  return null
}

export { ServiceWorkerRegistration }
