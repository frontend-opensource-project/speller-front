import { useWindowSize } from '@frontend-opensource/use-react-hooks'

export const useDeviceUtils = () => {
  const { width } = useWindowSize()

  return { isDesktop: width! >= 1377 }
}
