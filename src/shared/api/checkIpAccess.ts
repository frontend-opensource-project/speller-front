'use server'

import { ENDPOINT } from '../model/constants'

type Response = { denied?: 'true' | 'false' }

const errorMsg = '[Error] IP 필터링 서비스를 사용할 수 없습니다.'
const REVALIDATE_MS = 300 // 5분(300초)

const checkIpAccess = async (clientIP: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${ENDPOINT.FILTER_IP}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientIP }),
      cache: 'force-cache',
      next: {
        revalidate: REVALIDATE_MS,
      },
    },
  )

  if (!response.ok) {
    throw new Error(errorMsg)
  }

  const data: Response = await response.json()

  return isIpAccessDenied(data)
}

const isIpAccessDenied = (data: Response) => {
  // 응답값이 false인 경우 차단되어야 함
  const DENIED = false

  if (!data.denied) {
    throw new Error(errorMsg)
  }

  return Boolean(data.denied) === DENIED
}

export { checkIpAccess }
