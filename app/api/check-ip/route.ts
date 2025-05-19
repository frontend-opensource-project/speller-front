import { NextResponse } from 'next/server'

import { checkIpAllowed, CheckIpResponse } from '@/shared/api'

export const POST = async (req: Request) => {
  try {
    const { clientIP } = await req.json()
    const allowed = await checkIpAllowed(clientIP)
    const response: CheckIpResponse = { allowed }

    return NextResponse.json(response)
  } catch {
    const errorResponse: CheckIpResponse = { allowed: false }

    return NextResponse.json(errorResponse, { status: 400 })
  }
}
