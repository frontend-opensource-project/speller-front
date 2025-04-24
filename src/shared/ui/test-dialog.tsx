'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { UAParser } from 'ua-parser-js'

import { cn } from '@/shared/lib/tailwind-merge'
import { useKeyboardHeight } from '../lib/use-keyboard-height'

const DialogRoot = DialogPrimitive.Root

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

const Dialog = ({
  open,
  onOpenChange,
  children,
  DialogTriggerItem,
  className,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  DialogTriggerItem: React.ReactNode
  className?: string
}) => {
  // 디바이스 정보 파싱
  const { device, browser, os } = UAParser(window.navigator.userAgent)

  // Dialog 콘텐츠 참조
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  // 키보드 높이 관련 상태
  const { keyboardHeight, screenHeight, forceUpdateScreenHeight } =
    useKeyboardHeight()

  // 콘텐츠 높이 계산
  const contentHeight = contentRef.current?.offsetHeight ?? 0

  // 삼성 브라우저일 경우 툴바 보정
  const isSamsung = browser.name === 'Samsung Internet'
  const toolbarBuffer = isSamsung ? 48 : 0
  const adjustedKeyboardHeight = keyboardHeight + toolbarBuffer
  const isKeyboardOpen = adjustedKeyboardHeight > 0

  // 모바일 장치에서 화면 높이가 키보드에 맞춰 업데이트될 수 있도록 강제로 호출
  React.useEffect(() => {
    if (isKeyboardOpen) {
      forceUpdateScreenHeight()
    }
  }, [isKeyboardOpen, forceUpdateScreenHeight])

  // 브라우저/OS 조건 체크
  const isIOS = os.name === 'iOS'
  const isMobileChrome = browser.is('Mobile Chrome')

  // 모바일 Chrome에서는 화면보다 콘텐츠가 커야 키보드 패딩을 줄 필요가 있음
  const shouldApplySimpleOffset = isMobileChrome
    ? screenHeight >= contentHeight
    : screenHeight > contentHeight

  // 키보드가 열렸을 때 하단 여백 보정값 계산
  const getAdjustedPadding = () => {
    if (!isKeyboardOpen) return 0

    const remainingSpace = screenHeight - contentHeight

    if (isIOS) {
      const overflow = screenHeight + contentHeight - screenHeight
      const overflowCorrection = Math.max(0, overflow)
      return adjustedKeyboardHeight - overflowCorrection - remainingSpace
    }

    if (shouldApplySimpleOffset) {
      return adjustedKeyboardHeight
    }

    const overflow = screenHeight + contentHeight - window.innerHeight
    const overflowCorrection = Math.max(0, overflow)
    return adjustedKeyboardHeight - overflowCorrection - remainingSpace
  }

  const adjustedPadding = getAdjustedPadding()

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className='pc:hidden'>
        {DialogTriggerItem}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <div
          className='fixed inset-0 z-50 flex w-full items-center justify-center'
          style={{
            paddingBottom:
              device.type === 'mobile' ? adjustedPadding : undefined,
            transition: 'padding-bottom 0.3s ease',
          }}
        >
          <DialogPrimitive.Content
            ref={contentRef}
            style={{ maxHeight: screenHeight }}
            className={cn(
              device.type === 'mobile' ? dialogStyle.mobile : dialogStyle.web,
              className,
            )}
            onOpenAutoFocus={event => event.preventDefault()}
          >
            {children}
            <DialogClose className='absolute right-[1.15rem] top-[1.38rem] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground tab:right-[1.125rem] tab:top-[1.6356rem]'>
              <span className='inline-block h-3.5 w-3.5 bg-close bg-contain bg-no-repeat p-[0.2281rem] tab:h-4 tab:w-4' />
              <span className='sr-only'>Close</span>
            </DialogClose>
          </DialogPrimitive.Content>
        </div>
      </DialogPortal>
    </DialogRoot>
  )
}

const dialogStyle = {
  web: 'sm:rounded-lg fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-32px)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-[1.2rem] pt-[0.94rem] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
  mobile:
    'sm:rounded-lg relative z-50 grid max-h-[calc(100dvh-80px)] w-[calc(100%-32px)] max-w-lg gap-4 overflow-y-auto rounded-lg border bg-white p-[1.2rem] pt-[0.94rem] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
}

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
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
