import { DESKTOP, LARGE_DESKTOP, TABLET } from '../../../tailwind.config'

type Breakpoint = 'ssr' | 'mobile' | 'tablet' | 'desktop' | 'desktop-large'

const getBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'ssr'
  const width = window.innerWidth

  if (width < TABLET) return 'mobile'
  if (width < DESKTOP) return 'tablet'
  if (width < LARGE_DESKTOP) return 'desktop'

  return 'desktop-large'
}

export { getBreakpoint }
