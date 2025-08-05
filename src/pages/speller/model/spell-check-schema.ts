import { z } from 'zod'
import { checkResponseSchema } from '@/entities/speller'

export const unknownErrorResponseSchema = z.object({
  type: z.literal('unknown'),
  errorMessage: z.string(),
})

export const serverErrorResponseSchema = z.object({
  type: z.literal('server'),
  errorMessage: z.string(),
  errorCode: z.number(),
  requestPayload: z.object({
    isStrictCheck: z.boolean(),
    textLength: z.number(),
  }),
})

export const errorResponseSchema = unknownErrorResponseSchema.or(
  serverErrorResponseSchema,
)

export const spellCheckSchema = z.object({
  data: checkResponseSchema
    .extend({
      requestedWithStrictMode: z.boolean(),
    })
    .nullable(),
  error: errorResponseSchema.nullable(),
  elapsedTimeMs: z.number(),
})
