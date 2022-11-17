import React, { useContext } from 'react'
import { useState } from '@hookstate/core'
import { useTokenContext } from './TokenProvider'
import { SnapchatPublicProfile } from '../types/SnapchatPublicProfile'

const getPublicProfilesForOrganization = async (
  organization_id: string,
  access_token: string,
): Promise<SnapchatPublicProfile[]> => {
  const url = new URL('https://jhnrydwjrtzlshxlceiw.nhost.run/v1/functions/get-snapchat-public-profiles-for-organization')
  url.search = new URLSearchParams({ access_token, organization_id }).toString()
  const res = await fetch(url)

  if (res.status !== 200) {
    console.log(`${res.status}: ${res.statusText}`)
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  const profiles = JSON.parse(await res.text())
    .public_profiles
    .map((prof: any) => prof.public_profile) as SnapchatPublicProfile[]

  return profiles
}

interface Props {
  organization_id: string,
  children?: JSX.Element,
}

const SnapchatPublicProfilesContext = React.createContext(null)

export const SnapchatPublicProfilesProvider = ({ organization_id, children = null }: Props) => {
  const access_token = useTokenContext()
  const state = useState(
    () => getPublicProfilesForOrganization(organization_id, access_token)
  )

  if (state.promised) {
    return null
  }

  if (state.error) {
    return <p>Error: {state.error.message}</p>
  }

  return (
    <SnapchatPublicProfilesContext.Provider value={state.get()}>
      {children}
    </SnapchatPublicProfilesContext.Provider>
  )
}

export const useSnapchatPublicProfilesContext = (): SnapchatPublicProfile[] => {
  return useContext(SnapchatPublicProfilesContext)
}