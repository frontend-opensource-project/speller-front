'use client'

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
import { Notice } from '../model/notice.interface'

const KEY_PREFIX = 'speller-dialog'

export function NoticeDialog() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [defaultHide, setDefaultHide] = useState(true)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    fetch('/notice/notice.json')
      .then(res => res.json())
      .then(data => setNotice(data))
  }, [])

  useEffect(() => {
    if (!notice) return
    const key = `${KEY_PREFIX}-${notice.id}`
    const stored = localStorage.getItem(key) || ''
    if (!stored) {
      setDefaultHide(false)
      return
    }
    const expiryDate = parseInt(stored)
    if (Date.now() < expiryDate) return
    localStorage.removeItem(key)
    setDefaultHide(false)
  }, [notice])

  if (!notice || !notice.enabled) return null
  if (defaultHide) return null

  const handleCheckboxChange = (checked: boolean) => {
    const key = `${KEY_PREFIX}-${notice.id}`
    if (checked) {
      const oneWeekLater = Date.now() + 7 * 24 * 60 * 60 * 1000
      localStorage.setItem(key, oneWeekLater.toString())
    } else {
      localStorage.removeItem(key)
    }
    setIsChecked(checked)
  }

  return (
    <Dialog defaultOpen>
      <DialogContent
        className='max-w-[19.125rem] rounded-xl px-4 py-[1.125rem] tab:max-w-[22.5rem] tab:gap-5 tab:rounded-2xl tab:px-[1.125rem] tab:py-[1.375rem] pc:max-w-[28.125rem] pc:gap-6 pc:rounded-[1.25rem] pc:px-[1.5rem] pc:py-[1.625rem] [&>button]:hidden'
        aria-describedby={undefined}
      >
        <DialogTitle className='sr-only'>{notice.title}</DialogTitle>
        <Image
          src='/favicon.svg'
          alt='바른 한글 로고'
          width={34}
          height={34}
          className='size-[1.5rem] tab:size-[1.75rem] pc:size-[2.125rem]'
        />
        <div className='tracking-tight'>
          <h2 className='text-[1.75rem] tab:mt-1 tab:text-4xl pc:mt-2 pc:text-[2.75rem]'>
            {notice.title}
          </h2>
        </div>
        <div className='max-h-[45vh] space-y-2 overflow-y-auto text-base tab:max-h-[55vh] tab:text-lg pc:max-h-[60vh] pc:text-xl'>
          {Array.isArray(notice.contents)
            ? notice.contents.map((line: string, idx: number) => (
                <p key={idx}>{line}</p>
              ))
            : null}
        </div>
        <DialogFooter className='-mx-4 -mb-[1.125rem] rounded-b-xl bg-slate-200 p-4 tab:-mx-[1.125rem] tab:-mb-[1.375rem] tab:rounded-b-2xl pc:-mx-[1.5rem] pc:-mb-[1.625rem] pc:rounded-b-[1.25rem] pc:p-[1.125rem]'>
          <div className='flex items-center justify-between'>
            {notice.allowWeeklyDismiss && (
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
            )}
            <DialogClose asChild>
              <span className='ml-auto cursor-pointer pc:text-xl'>닫기</span>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
