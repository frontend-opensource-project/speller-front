'use client'

import { memo, useEffect, useMemo, useRef } from 'react'
import { BulletBadge, CorrectMethodEnum } from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'
import type { ErrorGroup, ErrorGroupSort } from '../lib/group-errors'
import { METHOD_LABEL } from './long-error-overlay'

// 기존 결과 화면 범례와 같은 순서
const METHOD_ORDER = [
  CorrectMethodEnum.enum.어법,
  CorrectMethodEnum.enum.문맥,
  CorrectMethodEnum.enum.흔한실수,
  CorrectMethodEnum.enum.분석실패,
]

interface LongErrorPanelProps {
  groups: ErrorGroup[]
  sort: ErrorGroupSort
  onSortChange: (sort: ErrorGroupSort) => void
  hiddenMethods: number[]
  onToggleMethod: (method: number) => void
  selectedGroupKey: string | null
  onSelectGroup: (group: ErrorGroup) => void
  progress: { done: number; total: number }
  bulkCounts: Record<string, number> // 모두 수정 · 모두 무시를 한 시점의 항목 수
}

/** 오른쪽 오류어 묶음 목록. 같은 오류(원문 · 1순위 대치어 · 유형)를 한 줄로 보여 준다 */
const LongErrorPanel = memo(
  ({
    groups,
    sort,
    onSortChange,
    hiddenMethods,
    onToggleMethod,
    selectedGroupKey,
    onSelectGroup,
    progress,
    bulkCounts,
  }: LongErrorPanelProps) => {
    const listRef = useRef<HTMLUListElement>(null)

    const counts = useMemo(() => {
      const result: Record<number, number> = {}
      groups.forEach(g => {
        result[g.correctMethod] = (result[g.correctMethod] ?? 0) + g.remaining
      })
      return result
    }, [groups])

    const visibleGroups = groups.filter(
      g => !hiddenMethods.includes(g.correctMethod),
    )

    // 문서에서 오류어를 고르면 그 묶음이 보이도록 목록을 옮긴다
    useEffect(() => {
      if (!selectedGroupKey || !listRef.current) return
      const row = listRef.current.querySelector<HTMLElement>(
        `[data-group-key="${CSS.escape(selectedGroupKey)}"]`,
      )
      row?.scrollIntoView({ block: 'nearest' })
    }, [selectedGroupKey])

    return (
      <aside
        aria-label='오류어 묶음'
        // 광고 iframe으로 포커스가 넘어갔어도 패널을 누르면 단축키가 다시 동작하도록 포커스를 받는다
        tabIndex={-1}
        className='flex min-h-0 w-[17.5rem] shrink-0 flex-col rounded-[1rem] bg-white p-4 outline-none dark:bg-dark-surface pc-lg:w-[20rem]'
      >
        <div className='flex items-baseline justify-between'>
          <h2 className='text-lg font-semibold'>오류어 묶음</h2>
          <span className='text-sm text-slate-400 dark:text-dark-subtle'>
            검사한 {progress.done}/{progress.total}구간 기준
          </span>
        </div>

        <div className='mt-3 flex flex-wrap gap-1.5'>
          {METHOD_ORDER.map(method => {
            const isHidden = hiddenMethods.includes(method)
            return (
              <button
                key={method}
                type='button'
                aria-pressed={!isHidden}
                onClick={() => onToggleMethod(method)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm',
                  isHidden
                    ? 'border-slate-200 text-slate-300 dark:border-dark-border dark:text-dark-subtle'
                    : 'border-slate-300 text-slate-600 dark:border-dark-border dark:text-dark-text',
                )}
              >
                <BulletBadge
                  method={method}
                  className={cn(isHidden && 'opacity-30')}
                />
                {METHOD_LABEL[method]}
                <span className='text-slate-400'>{counts[method] ?? 0}</span>
              </button>
            )
          })}
        </div>

        <div
          className='mt-3 flex gap-3 text-sm'
          role='radiogroup'
          aria-label='정렬'
        >
          {(
            [
              ['document', '문서 순서'],
              ['count', '많은 순'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type='button'
              role='radio'
              aria-checked={sort === value}
              onClick={() => onSortChange(value)}
              className={cn(
                sort === value
                  ? 'font-semibold text-slate-600 dark:text-dark-text'
                  : 'text-slate-400 dark:text-dark-subtle',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <ul
          ref={listRef}
          className='mt-2 min-h-0 flex-1 overflow-y-auto border-t border-slate-200 dark:border-dark-border'
        >
          {visibleGroups.length === 0 && (
            <li className='py-6 text-center text-sm text-slate-400 dark:text-dark-subtle'>
              {progress.done === 0
                ? '검사 중입니다…'
                : '표시할 오류가 없습니다.'}
            </li>
          )}
          {visibleGroups.map(group => {
            const isDone = group.remaining === 0
            const bulkCount = bulkCounts[group.key]
            const newCount =
              bulkCount !== undefined && !isDone
                ? group.items.length - bulkCount
                : 0
            return (
              <li key={group.key}>
                <button
                  type='button'
                  data-group-key={group.key}
                  aria-current={selectedGroupKey === group.key || undefined}
                  onClick={() => onSelectGroup(group)}
                  className={cn(
                    'flex w-full items-start gap-2 border-b border-slate-200 px-1 py-2 text-left dark:border-dark-border',
                    selectedGroupKey === group.key &&
                      'bg-slate-100 dark:bg-dark-elevated',
                    isDone && 'opacity-50',
                  )}
                >
                  <BulletBadge
                    method={group.correctMethod}
                    className='mt-2 shrink-0'
                  />
                  <span className='min-w-0 flex-1 break-all text-base'>
                    <span className={cn(isDone && 'line-through')}>
                      {group.orgStr}
                    </span>
                    {group.firstCandidate && (
                      <span className='text-slate-500 dark:text-dark-subtle'>
                        {' → '}
                        {group.firstCandidate}
                      </span>
                    )}
                  </span>
                  <span className='shrink-0 text-right text-sm text-slate-400 dark:text-dark-subtle'>
                    {isDone
                      ? '완료'
                      : `${group.remaining}/${group.items.length}`}
                    {newCount > 0 && (
                      <span className='block text-blue-500'>
                        새로 {newCount}곳
                      </span>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>
    )
  },
)

LongErrorPanel.displayName = 'LongErrorPanel'

export { LongErrorPanel }
