import React, { useContext } from 'react'
import { useState } from '@hookstate/core'
import { useTokenContext } from './TokenProvider'
import { SnapchatOrganization } from '../types/SnapchatOrganization'

const getOrganizationsForSnapchatAccount = async (
  access_token: string,
): Promise<SnapchatOrganization[]> => {
  const url = new URL('https://adsapi.snapchat.com/v1/me/organizations')

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })

  if (res.status !== 200) {
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  return (await res.json())
    .organizations
    .map((org: any) => org.organization) as SnapchatOrganization[]  
}

const SnapchatOrganisationsContext = React.createContext(null)

export const SnapchatOrganizationsProvider = ({ children = null }) => {
  const access_token = useTokenContext()
  const state = useState(
    () => getOrganizationsForSnapchatAccount(access_token)
  )
  
  if (state.promised) {
    return null
  }

  if (state.error) {
    return <p>Error: {state.error.message}</p>
  }

  return <SnapchatOrganisationsContext.Provider value={state.get()}>{children}</SnapchatOrganisationsContext.Provider>
}

export const useSnapchatOrganizationsContext = (): SnapchatOrganization[] => {
  return useContext(SnapchatOrganisationsContext)
}