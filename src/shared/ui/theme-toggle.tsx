'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from './button'

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant='ghost'
        size='icon'
        className='size-8 tab:size-9'
        aria-label='테마 전환'
      >
        <span className='size-4 tab:size-5' />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-8 tab:size-9'
      onClick={toggleTheme}
      aria-label={
        resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
      }
    >
      {resolvedTheme === 'dark' ? (
        <Sun className='size-4 tab:size-5' />
      ) : (
        <Moon className='size-4 tab:size-5' />
      )}
    </Button>
  )
}

export { ThemeToggle }
