'use client'

import { FC, PropsWithChildren } from 'react'

import { useClientIp } from '../lib/use-client-ip'
import { AccessDeniedMessage, IpCheckingFallback } from './ip-access-feedback'
import { useCheckClientIpAccess } from '../lib/use-check-access'

export const ClientIpGuard: FC<PropsWithChildren> = ({ children }) => {
  const clientIp = useClientIp()
  const allowed = useCheckClientIpAccess(clientIp)

  if (!clientIp || allowed === null) {
    return <IpCheckingFallback />
  }

  return allowed ? children : <AccessDeniedMessage />
}
