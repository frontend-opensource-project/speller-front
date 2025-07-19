'use client'

import { useEffect } from 'react'

const sendHeartbeatEvent = () => {
  // gtag 함수가 존재하고, 페이지가 사용자에게 보여질 때만 실행
  if (
    typeof window.gtag === 'function' &&
    document.visibilityState === 'visible'
  ) {
    window.gtag('event', 'heartbeat', {
      event_category: 'engagement',
      event_label: 'periodic_ping',
      non_interaction: true, // 핵심: 이탈률 등에 영향을 주지 않음
    })
    // 개발자 콘솔에서 확인용 로그
    console.log('❤️ Heartbeat event sent to GA4')
  }
}

const EngagementHeartbeat = () => {
  useEffect(() => {
    // 10초마다 하트비트 이벤트 전송
    const intervalId = setInterval(sendHeartbeatEvent, 10000)

    // 컴포넌트가 사라질 때 인터벌 정리 (메모리 누수 방지)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return null // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}

export default EngagementHeartbeat
