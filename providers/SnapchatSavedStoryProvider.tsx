import React, { useContext } from 'react'
import { useState } from '@hookstate/core'
import { useTokenContext } from './TokenProvider'
import { SnapchatSavedStory } from '../types/SnapchatSavedStory'

const getSavedStoriesForPublicProfile = async (
  profile_id: string,
  access_token: string,
): Promise<SnapchatSavedStory[]> => {
  const url = new URL('https://jhnrydwjrtzlshxlceiw.nhost.run/v1/functions/get-snapchat-saved-stories')
  url.search = new URLSearchParams({ access_token, profile_id }).toString()
  const res = await fetch(url)

  if (res.status !== 200) {
    console.log(`${res.status}: ${res.statusText}`)
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  const profiles = JSON.parse(await res.text())
    .saved_stories
    .map((prof: any) => prof.saved_story) as SnapchatSavedStory[]

  return profiles
}

interface Props {
  profile_id: string,
  children?: JSX.Element,
}

const SnapchatSavedStoryContext = React.createContext(null)

export const SnapchatSavedStoryProvider = ({ profile_id, children = null }: Props) => {
  const access_token = useTokenContext()
  const state = useState(
    () => getSavedStoriesForPublicProfile(profile_id, access_token)
  )

  if (state.promised) {
    return null
  }

  if (state.error) {
    return <p>Error: {state.error.message}</p>
  }

  return (
    <SnapchatSavedStoryContext.Provider value={state.get()}>
      {children}
    </SnapchatSavedStoryContext.Provider>
  )
}

export const useSnapchatSavedStoriesContext = (): SnapchatSavedStory[] => {
  return useContext(SnapchatSavedStoryContext)
}