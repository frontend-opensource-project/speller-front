'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { useRecaptcha } from '@/shared/lib/recaptcha/use-recaptcha'
import { verifyRecaptchaAction } from '../api/qa-board-actions'
import type { QaBoardSearchType } from '../model/qa-board-interface'

const SEARCH_TYPE_OPTIONS: { value: QaBoardSearchType; label: string }[] = [
  { value: 'title', label: '제목' },
  { value: 'author', label: '작성자' },
  { value: 'content', label: '내용' },
]

export function QaBoardSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { execute: executeRecaptcha } = useRecaptcha()

  const [searchType, setSearchType] = useState<QaBoardSearchType>(
    (searchParams?.get('searchType') as QaBoardSearchType) || 'title',
  )
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get('searchQuery') || '',
  )
  const [error, setError] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!searchQuery.trim()) {
      setError('검색어를 입력해주세요.')
      return
    }

    startTransition(async () => {
      try {
        const recaptchaToken = await executeRecaptcha('qa_board_search')
        const verifyResult = await verifyRecaptchaAction(
          recaptchaToken,
          'qa_board_search',
        )

        if (!verifyResult.success) {
          setError(verifyResult.error || '보안 검증에 실패했습니다.')
          return
        }

        setError(null)
        const params = new URLSearchParams()
        params.set('page', '1')
        params.set('searchType', searchType)
        params.set('searchQuery', searchQuery.trim())

        router.push(`/qa-board?${params.toString()}`)
      } catch {
        setError('보안 검증에 실패했습니다. 페이지를 새로고침 해주세요.')
      }
    })
  }

  const handleReset = () => {
    setSearchQuery('')
    startTransition(() => {
      router.push('/qa-board')
    })
  }

  return (
    <div className='flex flex-col gap-2'>
      <form onSubmit={handleSearch} className='flex gap-2'>
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value as QaBoardSearchType)}
          className='h-10 w-20 shrink-0 rounded-md border border-slate-300 bg-white px-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-border dark:bg-dark-surface'
        >
          {SEARCH_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className='flex flex-1 gap-2'>
          <input
            type='text'
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              if (error) setError(null)
            }}
            placeholder='검색어를 입력하세요'
            className='h-10 flex-1 rounded-md border border-slate-300 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-border'
          />

          <Button
            type='submit'
            disabled={isPending}
            className='h-10 gap-2 px-4'
          >
            <Search className='h-4 w-4' />
            <span className='sm:inline hidden'>검색</span>
          </Button>

          {searchParams?.get('searchQuery') && (
            <Button
              type='button'
              variant='outline'
              onClick={handleReset}
              disabled={isPending}
              className='h-10 px-4'
            >
              검색 취소
            </Button>
          )}
        </div>
      </form>

      {error && (
        <div className='text-red-600 flex items-center gap-2 text-sm'>
          <AlertCircle className='h-4 w-4 shrink-0' />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
