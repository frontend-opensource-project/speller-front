'use client'

import React, { useEffect, useState } from 'react'
import { spellCheckVersionAction } from '../api/version-action'

export const VersionInfo = () => {
  const [version, setVersion] = useState('')

  useEffect(() => {
    const fetchVersion = async () => {
      const { curVersion } = await spellCheckVersionAction()
      setVersion(curVersion)
    }

    fetchVersion()
  }, [])

  return <div>{version}</div>
}
