import { NextResponse } from 'next/server'

import { checkIpAllowed, CheckIpResponse } from '@/shared/api'

export const POST = async (req: Request) => {
  try {
    const { clientIp } = await req.json()
    const allowed = await checkIpAllowed(clientIp)
    const response: CheckIpResponse = { allowed }

    return NextResponse.json(response)
  } catch (error) {
    console.warn(
      error instanceof Error ? error.message : 'Unknown request error',
    )
    const errorResponse: CheckIpResponse = { allowed: true }

    return NextResponse.json(errorResponse, { status: 400 })
  }
}
