import { z } from 'zod'

export interface CheckIpRequest {
  clientIp: string
}

export const IpSchema = z.string().ip({ version: 'v4' })

export const CheckIpResponseSchema = z.object({
  allowed: z.boolean(),
})

export type CheckIpResponse = z.infer<typeof CheckIpResponseSchema>

export type ClientIpResult =
  | { isSuccess: true; ip: string; reason: null }
  | { isSuccess: false; ip: 'unknown'; reason: string }
