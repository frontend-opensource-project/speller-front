'use client'

import React, { ReactNode, useState } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { DialogHeader, DialogTitle, Dialog } from '@/shared/ui/dialog'
import { CustomTextEditorContent } from './custom-text-editor-content'
import EditIcon from '@/shared/ui/icon/icon-pencil-black.svg'

interface CustomTextEditorProps {
  children: ReactNode
}

export const CustomTextEditor = ({ children }: CustomTextEditorProps) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const handlePopoverClose = () => setPopoverOpen(false)
  const handleDialogClose = () => setDialogOpen(false)

  return (
    <>
      {/* pc */}
      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild className='hidden pc:block'>
          {children}
        </PopoverTrigger>
        <PopoverContent
          className='w-[18.0625rem] rounded-2xl p-[0.9rem] pt-[0.75rem]'
          sideOffset={8}
          align='start'
        >
          <div className='grid gap-[0.8rem]'>
            <div className='flex items-center justify-between'>
              <CustomTextEditorTitle />
              <Button
                variant='ghost'
                className='h-4 w-4 bg-close bg-contain bg-no-repeat p-[0.22rem] hover:bg-transparent'
                onClick={handlePopoverClose}
              ></Button>
            </div>
            <CustomTextEditorContent handleClose={handlePopoverClose} />
          </div>
        </PopoverContent>
      </Popover>

      {/* mobile,tab */}
      <Dialog
        onOpenChange={setDialogOpen}
        open={isDialogOpen}
        DialogTriggerItem={children}
        className='scrollbar-none max-w-[19.17rem] rounded-2xl bg-white p-[1.125rem] pt-[0.9375rem] tab:max-w-[22.5625rem]'
      >
        <DialogHeader>
          <DialogTitle>
            <VisuallyHidden>대치어 직접 수정하기</VisuallyHidden>
          </DialogTitle>
          <CustomTextEditorTitle />
        </DialogHeader>
        <CustomTextEditorContent handleClose={handleDialogClose} />
      </Dialog>
    </>
  )
}

const CustomTextEditorTitle = () => {
  return (
    <h4 className='flex items-center gap-3 text-[1.75rem] font-bold text-slate-600 pc:gap-[0.62rem] pc:text-[1.65rem]'>
      <EditIcon className='!size-[1.48rem] tab:!size-7 pc:!size-[1.4rem]' />
      <span className='text-[1.48rem] tab:text-[1.75rem] pc:text-[1.375rem]'>
        대치어 직접 수정하기
      </span>
    </h4>
  )
}
