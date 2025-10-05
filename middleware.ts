import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = `${basePath}/speller`
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: '/',
}
