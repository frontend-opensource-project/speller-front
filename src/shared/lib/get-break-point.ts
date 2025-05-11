type Breakpoint = 'ssr' | 'mobile' | 'tablet' | 'desktop'

const getBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'ssr'
  const width = window.innerWidth

  if (width < 726) return 'mobile'
  if (width < 1377) return 'tablet'

  return 'desktop'
}

export { getBreakpoint }
