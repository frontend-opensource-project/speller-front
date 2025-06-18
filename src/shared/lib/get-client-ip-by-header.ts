import 'server-only'

import { headers } from 'next/headers'

import { ClientIpResult, IpSchema } from '../api'

const getClientIpByHeader = async (): Promise<ClientIpResult> => {
  const requestHeaders = await headers()
  // 현재 프로덕션 환경을 기준으로 Cloudflare 우선
  const headerKeys = ['cf-connecting-ip', 'x-forwarded-for', 'x-real-ip']
  let clientIp: string | null = null

  for (const key of headerKeys) {
    const value = requestHeaders.get(key)

    if (value) {
      clientIp = value.split(',')[0].trim()
      break
    }
  }

  // IPv6 매핑된 IPv4 주소 처리 (::ffff:127.0.0.1 형식)
  if (clientIp) {
    const ipv4Pattern = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/
    const match = clientIp.match(ipv4Pattern)

    if (match) {
      clientIp = match[1]
    }

    const parsed = IpSchema.safeParse(clientIp)

    if (parsed.success) {
      return { isSuccess: true, ip: parsed.data, reason: null }
    }
  }

  return {
    isSuccess: false,
    ip: 'unknown',
    reason: `Failed to get IP from header information.`,
  }
}

export { getClientIpByHeader }
