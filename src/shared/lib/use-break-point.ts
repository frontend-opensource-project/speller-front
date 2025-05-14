import { useEffect, useRef, useState } from 'react'
import { getBreakpoint } from '../lib/get-break-point'

type Breakpoint = ReturnType<typeof getBreakpoint>

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint())
  const prevBreakpointRef = useRef<Breakpoint>(breakpoint)

  useEffect(() => {
    const update = () => {
      const current = getBreakpoint()
      if (prevBreakpointRef.current !== current) {
        prevBreakpointRef.current = current
        setBreakpoint(current)
      }
    }

    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return breakpoint
}
