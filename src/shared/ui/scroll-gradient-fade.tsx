import { FC } from 'react'

interface ScrollGradientFadeProps {
  showGradient: boolean
}

const ScrollGradientFade: FC<ScrollGradientFadeProps> = ({ showGradient }) => {
  return (
    <div
      className={`pointer-events-none relative bottom-5 left-0 right-0 h-5 w-full bg-gradient-to-b from-transparent to-white/100 transition-all duration-500 ease-in-out dark:to-dark-surface/100 tab:bottom-[1.875rem] tab:h-[1.875rem] ${showGradient ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}

export { ScrollGradientFade }
