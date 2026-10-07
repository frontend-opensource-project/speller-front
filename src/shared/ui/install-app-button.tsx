'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

import {
  getInstallEnvironment,
  type InstallEnvironment,
} from '@/shared/lib/get-install-environment'
import {
  clearInstallPrompt,
  useInstallPrompt,
} from '@/shared/lib/install-prompt'
import {
  sendAppInstallClickedEvent,
  sendAppInstallPromptResultEvent,
} from '@/shared/lib/send-ga-event'
import type { InstallPlatform } from '@/shared/lib/analytics-event-types'
import { Button } from './button'
import { InstallGuideDialog } from './install-guide-dialog'

const GUIDE_PLATFORM: Record<
  Exclude<InstallEnvironment['type'], 'browser' | 'standalone'>,
  InstallPlatform
> = {
  ios: 'ios',
  'macos-safari': 'macos_safari',
  'in-app': 'in_app',
}

/**
 * 헤더의 앱 설치 버튼. 모바일에서는 아이콘만, PC 에서는 아이콘과 '앱 설치' 문구를 보여 준다.
 *
 * @description
 * - Chromium 계열(Chrome·Edge·삼성 인터넷 등): 브라우저 설치 창을 띄운다. 설치할 수 없으면 숨긴다.
 * - iOS·macOS Safari·인앱 브라우저: 설치 창을 띄울 수 없어 안내 다이얼로그를 연다.
 * - 이미 설치된 앱으로 실행 중이면 숨긴다.
 * 환경은 브라우저에서만 알 수 있으므로 마운트 전에는 그리지 않는다.
 */
const InstallAppButton = () => {
  const installPrompt = useInstallPrompt()
  const [environment, setEnvironment] = useState<InstallEnvironment | null>(
    null,
  )
  const [guideOpen, setGuideOpen] = useState(false)

  useEffect(() => {
    setEnvironment(getInstallEnvironment())
  }, [])

  if (!environment || environment.type === 'standalone') return null
  if (environment.type === 'browser' && !installPrompt) return null

  const handleClick = async () => {
    if (environment.type !== 'browser') {
      sendAppInstallClickedEvent(GUIDE_PLATFORM[environment.type])
      setGuideOpen(true)
      return
    }

    if (!installPrompt) return
    sendAppInstallClickedEvent('prompt')
    clearInstallPrompt()
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    sendAppInstallPromptResultEvent(outcome)
  }

  return (
    <>
      <Button
        variant='ghost'
        className='size-8 bg-primary/10 p-0 text-primary ring-1 ring-inset ring-primary/25 hover:bg-primary/15 hover:text-primary dark:bg-primary/20 dark:text-blue-100 dark:ring-blue-300/40 dark:hover:bg-primary/30 dark:hover:text-blue-100 tab:size-9 pc:h-9 pc:w-auto pc:gap-1.5 pc:rounded-full pc:px-3.5 pc:font-semibold'
        onClick={handleClick}
        aria-label='앱 설치'
      >
        <Download />
        <span className='hidden pc:inline'>앱 설치</span>
      </Button>
      {environment.type !== 'browser' && (
        <InstallGuideDialog
          environment={environment}
          open={guideOpen}
          onOpenChange={setGuideOpen}
        />
      )}
    </>
  )
}

export { InstallAppButton }
