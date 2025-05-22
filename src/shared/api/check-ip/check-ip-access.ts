'use server'

import { ENDPOINT } from '../../config'
import { CheckIpRequest, CheckIpResponseSchema, IpSchema } from './schema'

const REVALIDATE_SEC = 300 // 5분(300초)
const errorMsg = {
  unknown: 'Unable to use the IP filtering service.',
  invalid: 'Invalid IP address.',
  parse: 'Failed to receive a valid IP response from the server.',
}

const checkIpAllowed = async (clientIp: string): Promise<boolean> => {
  const parsed = IpSchema.safeParse(clientIp)

  if (!parsed.success) {
    throw new Error(errorMsg.invalid)
  }

  const payload: CheckIpRequest = { clientIP: clientIp }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${ENDPOINT.FILTER_IP}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'force-cache',
      next: { revalidate: REVALIDATE_SEC },
    },
  )

  if (!response.ok) {
    throw new Error(errorMsg.unknown)
  }

  const json = await response.json()
  const parsedResponse = CheckIpResponseSchema.safeParse(json)

  if (!parsedResponse.success) {
    throw new Error(errorMsg.parse)
  }

  return parsedResponse.data.allowed
}

export { checkIpAllowed }
