'use client'

import { useMemo } from 'react'
import { useStore } from 'react-redux'
import {
  applyLongCorrections,
  errorKey,
  getPageText,
  ignoreLongErrors,
  type CorrectInfo,
} from '@/entities/speller'
import { useAppDispatch } from '@/shared/lib/use-redux'
import type { ErrorGroup } from '../lib/group-errors'
import { isProcessed } from '../lib/group-errors'
import {
  firstCandidate,
  logClickReplace,
  logNotChange,
  logUserReplace,
} from '../api/long-logs'

interface ErrorRef {
  pageIdx: number
  info: CorrectInfo
}

/** 긴글 모드의 교정 동작. 상태를 바꾸고 필요한 로그를 함께 보낸다 */
const useLongCorrections = () => {
  const dispatch = useAppDispatch()
  const store = useStore<RootState>()

  return useMemo(() => {
    const pageText = (pageIdx: number) =>
      getPageText(store.getState().longCheck, pageIdx)

    // 대치어 목록에서 고름. 1순위가 아니면 /clickReplace
    const choose = ({ pageIdx, info }: ErrorRef, word: string) => {
      dispatch(
        applyLongCorrections([
          { key: errorKey(pageIdx, info.errorIdx), crtStr: word },
        ]),
      )
      if (word !== firstCandidate(info)) {
        logClickReplace(pageText(pageIdx), info, word)
      }
    }

    // 직접 수정. /userReplace
    const replaceByUser = ({ pageIdx, info }: ErrorRef, word: string) => {
      dispatch(
        applyLongCorrections([
          { key: errorKey(pageIdx, info.errorIdx), crtStr: word },
        ]),
      )
      logUserReplace(pageText(pageIdx), info, word)
    }

    const revert = ({ pageIdx, info }: ErrorRef) =>
      dispatch(
        applyLongCorrections([
          { key: errorKey(pageIdx, info.errorIdx), crtStr: undefined },
        ]),
      )

    // 무시. /notChange
    const ignore = (refs: ErrorRef[]) => {
      if (refs.length === 0) return
      dispatch(
        ignoreLongErrors(refs.map(r => errorKey(r.pageIdx, r.info.errorIdx))),
      )
      logNotChange(
        refs.map(r => ({ pageText: pageText(r.pageIdx), info: r.info })),
      )
    }

    // 묶음에서 아직 처리하지 않은 항목만 대상으로 한다
    const pendingItems = (group: ErrorGroup) => {
      const { ignored } = store.getState().longCheck
      return group.items.filter(item => !isProcessed({ ignored }, item))
    }

    const correctGroup = (group: ErrorGroup) => {
      const items = pendingItems(group)
      dispatch(
        applyLongCorrections(
          items.map(item => ({ key: item.key, crtStr: group.firstCandidate })),
        ),
      )
      return items.length
    }

    const ignoreGroup = (group: ErrorGroup) => {
      const items = pendingItems(group)
      ignore(items.map(({ pageIdx, info }) => ({ pageIdx, info })))
      return items.length
    }

    return {
      choose,
      replaceByUser,
      revert,
      ignore,
      correctGroup,
      ignoreGroup,
    }
  }, [dispatch, store])
}

export { useLongCorrections, type ErrorRef }
