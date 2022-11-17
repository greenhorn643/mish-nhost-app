import { useState } from '@hookstate/core'
import React, { useContext } from 'react'
import { useSnapchatAccountContext } from './SnapchatAccountProvider'

interface TokenInfo {
  expiresAt: number,
  access_token: string,
  refresh_token: string,
}

interface RawTokenInfo {
  expires_in: number,
  token_type: string,
  refresh_token: string,
  access_token: string,
  scope?: string,
}

const getNewToken = async (refresh_token: string): Promise<TokenInfo> => {
  const url = new URL('https://jhnrydwjrtzlshxlceiw.nhost.run/v1/functions/refresh-snapchat-access-token')
  url.search = new URLSearchParams({ refresh_token }).toString()

  const requestTime = Date.now()
  const res = await fetch(url)

  if (res.status !== 200) {
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  const {
    expires_in,
    access_token,
  } = JSON.parse(await res.text()) as RawTokenInfo

  return {
    expiresAt: requestTime + expires_in,
    access_token,
    refresh_token,
  }
}

const TokenContext = React.createContext(null)

export const TokenProvider = ({ children = null }) => {
  const { refresh_token } = useSnapchatAccountContext()
  const state = useState(() => getNewToken(refresh_token))

  if (state.promised) {
    return null
  }

  if (state.error) {
    return <p>Error: {state.error.message}</p>
  }

  return (
    <TokenContext.Provider value={state.get()}>
      {children}
    </TokenContext.Provider>
  )
}

export const useTokenContext = (): string => {
  const tokenInfo: TokenInfo = useContext(TokenContext)
  return tokenInfo.access_token
}