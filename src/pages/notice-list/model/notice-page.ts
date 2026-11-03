/** 한 페이지에 보여 줄 공지 개수 */
export const NOTICE_PAGE_SIZE = 10

/**
 * `?page=` 값을 페이지 번호로 바꾼다.
 * 숫자가 아니거나 1 이하면 1페이지로 본다.
 */
export const getNoticePageNumber = (page?: string) => {
  const parsed = Number(page)
  return Number.isInteger(parsed) && parsed > 1 ? parsed : 1
}
