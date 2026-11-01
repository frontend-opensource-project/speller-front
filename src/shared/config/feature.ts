/**
 * 긴글 모드 사용 여부. 테스트 서버에서만 켠다 (`NEXT_PUBLIC_LONG_MODE=true`).
 * 빌드할 때 값이 고정되므로 바꾸면 다시 빌드해야 한다.
 */
export const LONG_MODE_ENABLED = process.env.NEXT_PUBLIC_LONG_MODE === 'true'
