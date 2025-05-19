'use server'

import { z } from 'zod'

import { ENDPOINT } from '../config'

const REVALIDATE_SEC = 300 // 5분(300초)
const errorMsg = {
  unknown: '[Error] Unable to use the IP filtering service.',
  invalid: '[Error] Invalid IP address.',
  parse: '[Error] Failed to receive a valid IP response from the server.',
}

const IpSchema = z.string().ip({ version: 'v4' })
const IpAccessSchema = z.object({
  allowed: z.boolean(),
})

const checkIpAccess = async (clientIp: string): Promise<boolean> => {
  const parsed = IpSchema.safeParse(clientIp)

  if (!parsed.success) {
    throw new Error(errorMsg.invalid)
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${ENDPOINT.FILTER_IP}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientIp }),
      cache: 'force-cache',
      next: { revalidate: REVALIDATE_SEC },
    },
  )

  if (!response.ok) {
    throw new Error(errorMsg.unknown)
  }

  const json = await response.json()
  const parsedResponse = IpAccessSchema.safeParse(json)

  if (!parsedResponse.success) {
    throw new Error(errorMsg.parse)
  }

  return parsedResponse.data.allowed
}

export { checkIpAccess }
