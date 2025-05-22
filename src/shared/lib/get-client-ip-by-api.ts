import 'client-only'

import { ClientIpResult, IpSchema } from '../api'

const IPIFY_API = {
  url: 'https://api.ipify.org?format=json',
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

export { getClientIpByApi }
