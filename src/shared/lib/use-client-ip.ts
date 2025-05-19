'use client'

import { useEffect, useState } from 'react'

import { ClientIpResult, getClientIpByApi } from './get-client-ip'

export const useClientIp = () => {
  const [ipState, setIpState] = useState<ClientIpResult>()

  useEffect(() => {
    getClientIpByApi().then(data => setIpState(data))
  }, [])

  return ipState
}
