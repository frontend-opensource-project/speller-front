'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/shared/ui/dialog'
import { Checkbox } from '@/shared/ui/checkbox'
import { useLocalStorage } from '@frontend-opensource/use-react-hooks'

const HIDE_DIALOG_KEY = 'speller-hide-dialog-until'

export function ServiceUpdateInfoDialog() {
  const [hideDialogUntil, setHideDialogUntil] = useLocalStorage(
    HIDE_DIALOG_KEY,
    '',
  )

  const [defaultHide, setDefaultHide] = useState(true)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    if (!hideDialogUntil) {
      setDefaultHide(false)
      return
    }

    const expiryDate = parseInt(hideDialogUntil)
    if (Date.now() < expiryDate) return
    setHideDialogUntil('')
  }, [])

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      const oneWeekLater = Date.now() + 7 * 24 * 60 * 60 * 1000
      setHideDialogUntil(oneWeekLater.toString())
    } else {
      setHideDialogUntil('')
    }
    setIsChecked(checked)
  }

  if (defaultHide) return null

  return (
    <Dialog defaultOpen>
      <DialogContent
        className='max-w-[19.125rem] overflow-hidden rounded-xl px-4 py-[1.125rem] tab:max-w-[22.5rem] tab:gap-5 tab:rounded-2xl tab:px-[1.125rem] tab:py-[1.375rem] pc:max-w-[28.125rem] pc:gap-6 pc:rounded-[1.25rem] pc:px-[1.5rem] pc:py-[1.625rem] [&>button]:hidden'
        aria-describedby={undefined}
      >
        <DialogTitle className='sr-only'>서비스 리뉴얼 안내</DialogTitle>
        <Image
          src='/favicon.svg'
          alt='바른 한글 로고'
          width={34}
          height={34}
          className='size-[1.5rem] tab:size-[1.75rem] pc:size-[2.125rem]'
        />
        <div className='tracking-tight'>
          <p className='text-lg tab:text-2xl pc:text-[1.75rem]'>
            한국어 맞춤법 검사기가
          </p>
          <p className='mt-2 flex items-end text-[1.75rem] tab:text-4xl pc:mt-3 pc:text-[2.75rem]'>
            <Image
              src='/text-logo.svg'
              alt='바른 한글 텍스트 로고'
              width={166}
              height={43}
              className='mb-1 h-[1.875rem] w-[7.1875rem] tab:h-[2.1875rem] tab:w-[8.5rem] pc:h-[2.6875rem] pc:w-[10.375rem]'
            />
            <span className='leading-none'>로</span>
          </p>
          <p className='text-[1.75rem] tab:mt-1 tab:text-4xl pc:mt-2 pc:text-[2.75rem]'>
            새롭게 태어났어요!
          </p>
          <p className='mt-3 text-base font-light tab:mt-4 tab:text-[1.125rem] pc:mt-5 pc:text-[1.375rem]'>
            더욱 편리하게,
            <br />
            한결 더 개선된 서비스
          </p>
        </div>
        <Link
          href='/guide'
          className='mb-2 mt-1 w-fit rounded-lg border border-slate-600 px-4 py-2 text-lg !leading-none tab:mb-3 tab:px-3 tab:py-[0.625rem] tab:text-xl pc:mb-6 pc:px-8 pc:py-4 pc:text-2xl'
        >
          사용법 확인하기
        </Link>
        <DialogFooter className='-mx-4 -mb-[1.125rem] bg-slate-200 p-4 tab:-mx-[1.125rem] tab:-mb-[1.375rem] pc:-mx-[1.5rem] pc:-mb-[1.625rem] pc:p-[1.125rem]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='chk'
                className='size-7 rounded-full border-slate-300 pc:size-9'
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
              />
              <label htmlFor='chk' className='text-slate-500 pc:text-xl'>
                일주일간 보지 않기
              </label>
            </div>
            <DialogClose asChild>
              <span className='cursor-pointer pc:text-xl'>닫기</span>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
