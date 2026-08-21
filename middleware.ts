import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone()
  // nextUrl.pathname 에는 basePath 가 빠져 있고, 리다이렉트할 때 Next 가 다시 붙인다.
  // 여기서 basePath 를 직접 붙이면 경로가 이중으로 쌓인다.
  redirectUrl.pathname = '/speller'

  // 308(영구). 307(기본값)은 임시 이동이라 검색엔진이 링크 평가를 메인으로 모으지 않는다.
  return NextResponse.redirect(redirectUrl, 308)
}

export const config = {
  matcher: '/',
}
