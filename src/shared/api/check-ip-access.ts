'use server'

import { ENDPOINT } from '../config'

type ResponseData = { denied?: 'true' | 'false' }

const errorMsg = '[Error] IP 필터링 서비스를 사용할 수 없습니다.'
const REVALIDATE_SEC = 300 // 5분(300초)

const checkIpAccess = async (clientIp: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${ENDPOINT.FILTER_IP}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientIp }),
      cache: 'force-cache',
      next: {
        revalidate: REVALIDATE_SEC,
      },
    },
  )

  if (!response.ok) {
    throw new Error(errorMsg)
  }

  const data: ResponseData = await response.json()

  return isIpAccessDenied(data)
}

const isIpAccessDenied = (payload: ResponseData) => {
  const isDeniedFieldMissing = payload.denied === undefined

  if (isDeniedFieldMissing) {
    throw new Error(errorMsg)
  }

  // 응답값이 false인 경우 차단되어야 함
  const isAccessDenied = payload.denied === 'false'

  return isAccessDenied
}

export { checkIpAccess }
