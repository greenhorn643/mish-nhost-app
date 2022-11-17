import React, { useContext } from 'react'
import { useState } from '@hookstate/core'
import { useTokenContext } from './TokenProvider'
import { SnapchatSavedStorySnap } from '../types/SnapchatSavedStorySnap'

const getSnapsForSavedStory = async (
  profile_id: string,
  saved_story_id: string,
  access_token: string,
): Promise<SnapchatSavedStorySnap[]> => {
  const url = new URL('https://jhnrydwjrtzlshxlceiw.nhost.run/v1/functions/get-snapchat-saved-story-snaps')
  url.search = new URLSearchParams({ access_token, profile_id, saved_story_id }).toString()
  const res = await fetch(url)

  if (res.status !== 200) {
    console.log(`${res.status}: ${res.statusText}`)
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  const profiles = JSON.parse(await res.text())
    .snaps
    .map((prof: any) => prof.snap) as SnapchatSavedStorySnap[]

  return profiles
}

interface Props {
  profile_id: string,
  saved_story_id: string,
  children?: JSX.Element,
}

const SnapchatSavedStorySnapsContext = React.createContext(null)

export const SnapchatSavedStorySnapsProvider = ({ profile_id, saved_story_id, children = null }: Props) => {
  const access_token = useTokenContext()
  const state = useState(
    () => getSnapsForSavedStory(profile_id, saved_story_id, access_token)
  )

  if (state.promised) {
    return null
  }

  if (state.error) {
    return <p>Error: {state.error.message}</p>
  }

  return (
    <SnapchatSavedStorySnapsContext.Provider value={state.get()}>
      {children}
    </SnapchatSavedStorySnapsContext.Provider>
  )
}

export const useSnapchatSavedStorySnapsContext = (): SnapchatSavedStorySnap[] => {
  return useContext(SnapchatSavedStorySnapsContext)
}