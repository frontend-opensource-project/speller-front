'use server'

import { headers } from 'next/headers'

const IPIFY_API = {
  url: 'https://api.ipify.org?format=json',
}

type ClientIpResult =
  | { isSuccess: true; ip: string; reason: null }
  | { isSuccess: false; ip: 'unknown'; reason: string }

const getClientIp = async (): Promise<ClientIpResult> => {
  const requestHeaders = await headers()
  // 우선순위에 따라 헤더에서 IP 추출
  const headerKeys = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'true-client-ip',
    'fastly-client-ip',
    'x-cluster-client-ip',
  ]
  let clientIP: string | null = null

  for (const key of headerKeys) {
    const value = requestHeaders.get(key)

    if (value) {
      clientIP = value.split(',')[0].trim()
      break
    }
  }

  // IPv6 매핑된 IPv4 주소 처리 (::ffff:127.0.0.1 형식)
  if (clientIP) {
    const ipv4Pattern = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/
    const match = clientIP.match(ipv4Pattern)

    if (match) {
      clientIP = match[1]
    }

    return { isSuccess: true, ip: clientIP, reason: null }
  }

  // 헤더에서 IP를 찾지 못한 경우 외부 API를 통해 조회
  try {
    const response = await fetch(IPIFY_API.url)

    if (!response.ok) {
      throw new Error(`Failed to fetch IP: ${response.statusText}`)
    }

    const data: { ip?: string } = await response.json()

    if (typeof data.ip === 'string' && data.ip.trim() !== '') {
      return { isSuccess: true, ip: data.ip, reason: null }
    }

    throw new Error('IP address not found in response')
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'internal error'

    return {
      isSuccess: false,
      ip: 'unknown',
      reason: `Error fetching IP from external API: ${reason}`,
    }
  }
}

export { getClientIp }
