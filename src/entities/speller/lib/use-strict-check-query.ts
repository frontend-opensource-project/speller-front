'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const QUERY_NAME = 'isStrictCheck' as const

const useStrictCheckQuery = () => {
  const searchParams = useSearchParams()

  if (!searchParams) return false

  return searchParams.get(QUERY_NAME) === 'true'
}

const useSetStrictCheckQuery = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  return (checked: boolean) => {
    if (!searchParams) return

    const params = new URLSearchParams(searchParams.toString())

    if (checked) {
      params.set(QUERY_NAME, 'true')
    } else {
      params.delete(QUERY_NAME)
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }
}

export { useStrictCheckQuery, useSetStrictCheckQuery }
