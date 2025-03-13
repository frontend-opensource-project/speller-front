'use client'

import { useToast } from '@/shared/lib/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/shared/ui/toast'
import WarningIcon from '@/shared/ui/icon/toast-warning.svg'
import CheckIcon from '@/shared/ui/icon/toast-check.svg'
import React from 'react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection='up' duration={3000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className='grid gap-1'>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>
                  <div className='flex items-center gap-[1.03rem]'>
                    {props.variant === 'default' && <CheckIcon />}
                    {props.variant === 'destructive' && <WarningIcon />}
                    {typeof description === 'string'
                      ? description.split('\n').map((text, index) => (
                          <React.Fragment key={index}>
                            {text}
                            <br />
                          </React.Fragment>
                        ))
                      : description}
                  </div>
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
