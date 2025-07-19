'use client'

import { useEffect, useState } from 'react'

import { ClientIpResult } from '../api'
import { getClientIpByApi } from './get-client-ip-by-api'

export const useClientIp = () => {
  const [ipState, setIpState] = useState<ClientIpResult>()

  useEffect(() => {
    getClientIpByApi().then(data => setIpState(data))
  }, [])

  return ipState
}
