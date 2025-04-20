'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'

import { ScrollContainer } from './scroll-container'
import { cn } from '../lib/tailwind-merge'

export interface TextareaHandle {
  textClear: () => void
  hydrateText: (payload: string) => void
}

interface TextareaProps {
  placeholder: string
  onChange: (value: string) => void
  name?: string
  className?: React.HTMLAttributes<HTMLDivElement>['className']
  onScroll?: (isScrolling: boolean) => void
}

const Textarea = forwardRef<TextareaHandle, TextareaProps>(
  ({ className, onScroll, onChange, placeholder, name }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const syncTextareaHeight = () => {
      const textarea = textareaRef.current

      if (!textarea) return

      textarea.style.height = 'auto'

      if (textarea.value.length <= 0) {
        textarea.style.height = '100%'
      } else {
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }

    const setTextareaValue = (value: string) => {
      if (!textareaRef.current) return

      textareaRef.current.value = value
    }

    useImperativeHandle(
      ref,
      () => ({
        textClear: () => {
          if (!textareaRef.current) return

          onChange('')
          setTextareaValue('')
          syncTextareaHeight()
        },
        hydrateText: payload => {
          setTextareaValue(payload)
          syncTextareaHeight()
        },
      }),
      [onChange],
    )

    return (
      <div className='relative h-full'>
        <ScrollContainer
          isFocused
          onScrollStatusChange={onScroll}
          className='absolute inset-0 overflow-hidden'
        >
          <textarea
            ref={textareaRef}
            name={name}
            placeholder={placeholder}
            className={cn(
              'flex h-full w-full resize-none overflow-hidden whitespace-pre-wrap break-all border-none border-input text-justify align-top text-[1.125rem] text-base font-normal leading-[1.8rem] tracking-[-0.0225rem] text-slate-600 ring-offset-background placeholder:text-muted-foreground placeholder:text-slate-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 tab:leading-[1.9125rem] pc:text-[1.25rem] pc:leading-[2.125rem] pc:tracking-[-0.025rem]',
              className,
            )}
            onInput={({ currentTarget: { value } }) => {
              onChange(value)
              syncTextareaHeight()
            }}
          />
        </ScrollContainer>
      </div>
    )
  },
)

Textarea.displayName = 'CustomScrollTextarea'

export { Textarea }
