'use server'

import { headers } from 'next/headers'

import { IpSchema } from '../api'

const IPIFY_API = {
  url: 'https://api.ipify.org?format=json',
}

export type ClientIpResult =
  | { isSuccess: true; ip: string; reason: null }
  | { isSuccess: false; ip: 'unknown'; reason: string }

const getClientIpByHeader = async (): Promise<ClientIpResult> => {
  const requestHeaders = await headers()
  // 현재 프로덕션 환경을 기준으로 Cloudflare 우선
  const headerKeys = ['cf-connecting-ip']
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

    const parsed = IpSchema.safeParse(clientIP)

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

const getClientIpByApi = async (): Promise<ClientIpResult> => {
  try {
    const response = await fetch(IPIFY_API.url)

    if (!response.ok) {
      throw new Error(`Failed to fetch IP: ${response.statusText}`)
    }

    const data: { ip?: string } = await response.json()
    const parsed = IpSchema.safeParse(data.ip)

    if (parsed.success) {
      return { isSuccess: true, ip: parsed.data, reason: null }
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

export { getClientIpByHeader, getClientIpByApi }
