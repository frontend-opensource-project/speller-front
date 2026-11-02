/**
 * 긴글 모드 사용 여부. 테스트 서버에서만 켠다 (`NEXT_PUBLIC_LONG_MODE=true`).
 * 빌드할 때 값이 고정되므로 바꾸면 다시 빌드해야 한다.
 */
export const LONG_MODE_ENABLED = process.env.NEXT_PUBLIC_LONG_MODE === 'true'

/**
 * 입력 화면에 이 쿼리(`?normalCheck=1`)를 붙여 들어오면 긴글 모드를 건너뛰고 바로 일반 검사를 한 번 한다.
 * 긴글 화면의 '일반 모드에서 검사'(광고 차단 안내)에서 쓴다.
 */
export const NORMAL_CHECK_QUERY = 'normalCheck'
