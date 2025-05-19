import { z } from 'zod'

export interface CheckIpRequest {
  clientIP: string
}

export const IpSchema = z.string().ip({ version: 'v4' })

export const CheckIpResponseSchema = z.object({
  allowed: z.boolean(),
})

export type CheckIpResponse = z.infer<typeof CheckIpResponseSchema>
