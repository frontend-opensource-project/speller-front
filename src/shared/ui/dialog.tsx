'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from '@/shared/lib/tailwind-merge'
import { useState } from 'react'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [dialogTop, setDialogTop] = React.useState<string | undefined>(
    undefined,
  )
  const [hasResized, setHasResized] = useState(false)
  const [log, setLog] = React.useState({
    viewportHeight: 0,
    dialogHeight: 0,
    offsetTop: 0,
    top: 0,
  })

  React.useEffect(() => {
    const updatePosition = () => {
      const el = contentRef.current
      if (!el) return

      setHasResized(true)

      // FIXME: 모바일 기기에서 처음 팝업 열 때 팝업이 상단으로 치우침. 이후 키보드패드 제거 후 다시 입력을 시도하면 이후부터는 중앙에 위치함
      const viewportHeight = window.visualViewport!.height ?? window.innerHeight
      const dialogHeight = el.offsetHeight
      const top = (viewportHeight - dialogHeight) / 2 // 전체 공간에서 요소 높이를 빼고, 남은 공간을 반씩 나누기
      setDialogTop(`${top}px`)

      setLog({
        viewportHeight,
        dialogHeight,
        offsetTop: window.visualViewport!.offsetTop,
        top,
      })
    }

    window.visualViewport?.addEventListener('resize', updatePosition)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.visualViewport?.removeEventListener('resize', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [])
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={node => {
          contentRef.current = node

          if (typeof ref === 'function') {
            ref(node)
          } else if (ref && 'current' in ref) {
            ;(ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node
          }
        }}
        className={cn(
          'sm:rounded-lg fixed left-[50%] z-50 grid w-[calc(100%-32px)] max-w-lg translate-x-[-50%] gap-4 border bg-background p-[1.2rem] pt-[0.94rem] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          !hasResized && 'translate-y-[-50%]', // resize 전에는 translate-y-[-50%] 적용해서 팝업 중앙으로 이동
          className,
        )}
        style={{
          top: dialogTop ?? '50%',
        }}
        {...props}
      >
        {/* 위치 확인용. 수정 후 제거 */}
        dialog: {dialogTop}, {log.dialogHeight}, {log.viewportHeight},
        {log.offsetTop}
        {/* ----- */}
        {children}
        {/* 위치 확인용. 수정 후 제거 */}
        dialog: {dialogTop}, {log.dialogHeight}, {log.viewportHeight},
        {log.offsetTop}, {hasResized ? 'T' : 'F'}
        {/* ----- */}
        <DialogPrimitive.Close className='absolute right-[1.15rem] top-[1.38rem] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground tab:right-[1.125rem] tab:top-[1.6356rem]'>
          <span className='inline-block h-3.5 w-3.5 bg-close bg-contain bg-no-repeat p-[0.2281rem] tab:h-4 tab:w-4' />
          <span className='sr-only'>Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('sm:text-left flex flex-col text-center', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'sm:flex-row sm:justify-end sm:space-x-2 flex flex-col-reverse',
      className,
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
