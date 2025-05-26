'use client'

import React, { memo } from 'react'

import { Label } from '@/shared/ui/label'
import { Switch } from '@/shared/ui/switch'
import {
  useSetStrictCheckQuery,
  useStrictCheckQuery,
} from '../lib/use-strict-check-query'

const SpellerSetting = memo(() => {
  const isStrict = useStrictCheckQuery()
  const setStrict = useSetStrictCheckQuery()

  const handleCheckedChange = (checked: boolean) => {
    setStrict(checked)
  }

  return (
    <div className='flex items-center justify-end gap-2 pc:gap-4'>
      <Label
        htmlFor='airplane-mode'
        className='self-center text-base font-medium leading-[1.40625rem] tracking-[-0.01875rem] text-slate-600 pc:text-xl pc:leading-[2rem] pc:tracking-[-0.025rem]'
      >
        강한 검사
      </Label>
      <Switch
        role='switch'
        aria-label='강한 검사 모드 켜기/끄기'
        id='airplane-mode'
        name='isStrictCheck'
        onCheckedChange={handleCheckedChange}
        checked={isStrict}
      />
    </div>
  )
})

SpellerSetting.displayName = 'SpellerSetting'

export { SpellerSetting }
