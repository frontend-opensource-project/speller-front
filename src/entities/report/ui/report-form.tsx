'use client'

import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import React, { ReactNode, useState } from 'react'
import { ReportFormContent } from './report-form-content'
import SendIcon from '@/shared/ui/icon/icon-send-black.svg'

interface ReportFormProps {
  children: ReactNode
}

export const ReportForm = ({ children }: ReportFormProps) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const handlePopoverClose = () => setPopoverOpen(false)
  const handleDialogClose = () => setDialogOpen(false)

  return (
    <>
      {/* pc */}
      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild className='hidden pc:inline-flex'>
          {children}
        </PopoverTrigger>
        <PopoverContent
          className='w-[21.66rem] rounded-2xl px-[0.9rem] pb-4 pt-[0.9rem]'
          sideOffset={0.5}
          align='end'
        >
          <div className='grid'>
            <div className='flex items-center justify-between'>
              <ReportFormTitle />
              <Button
                variant='ghost'
                className='h-4 w-4 bg-close bg-contain bg-no-repeat p-[0.22rem] hover:bg-transparent'
                onClick={handlePopoverClose}
              ></Button>
            </div>
            <ReportFormContent handleClose={handlePopoverClose} />
          </div>
        </PopoverContent>
      </Popover>
      {/* mobile,tab */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild className='pc:hidden'>
          {children}
        </DialogTrigger>
        <DialogContent className='max-w-[19.1781rem] rounded-2xl bg-white p-[0.95rem] tab:max-w-[22.5625rem] tab:px-4'>
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>제보 작성하기</VisuallyHidden>
            </DialogTitle>
            <ReportFormTitle />
          </DialogHeader>
          <ReportFormContent handleClose={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}

const ReportFormTitle = () => {
  return (
    <h4 className='flex items-center gap-2.5 font-bold text-slate-600 tab:gap-3 pc:gap-[0.62rem]'>
      <SendIcon className='size-[1.48rem] tab:!size-7 pc:!size-[1.375rem]' />
      <span className='text-[1.48rem] tab:text-[1.75rem] pc:text-[1.375rem]'>
        제보 작성하기
      </span>
    </h4>
  )
}
