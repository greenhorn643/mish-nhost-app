import { createState, State, useState } from '@hookstate/core'
import { Persistence } from '@hookstate/persistence'
import { useSnapchatAccountsContext } from '../providers/SnapchatAccountsProvider'

interface AccessTokenInfo {
  expiresAt: number,
  refresh_token: string,
  access_token: string,
}

interface RawTokenInfo {
  expires_in: number,
  token_type: string,
  refresh_token: string,
  access_token: string,
  scope?: string,
}

const initialAccessTokens: Record<string, AccessTokenInfo> = {}

const accessTokens = createState(initialAccessTokens)

const useAccessTokens = (): State<Partial<Record<string, AccessTokenInfo>>, {}> => {
  const tokens = useState(accessTokens)
  tokens.attach(Persistence('accessTokens'))
  return tokens
}

const refreshToken = async (refresh_token: string): Promise<AccessTokenInfo> => {
  const url = new URL('https://jhnrydwjrtzlshxlceiw.nhost.run/v1/functions/refresh-snapchat-access-token')
  url.search = new URLSearchParams({ refresh_token }).toString()

  const requestTime = Date.now()
  const res = await fetch(url)

  if (res.status !== 200) {
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  const {
    expires_in,
    refresh_token: new_refresh_token,
    access_token,
  } = JSON.parse(await res.text()) as RawTokenInfo

  return {
    expiresAt: requestTime + expires_in,
    refresh_token: new_refresh_token,
    access_token,
  }
}

const tokenIsExpired = (token: AccessTokenInfo): boolean => {
  return token.expiresAt <= Date.now()
}

const getRefreshToken = (snapchatAccountId: string): string => {
  const accounts = useSnapchatAccountsContext()
  const account = accounts.find(account => account.id === snapchatAccountId)
  if (account) {
    return account.refresh_token
  } else {
    throw new Error(`snapchat account ${snapchatAccountId} not found`)
  }
}

const getAccessToken = async (snapchatAccountId: string): Promise<string> => {
  const tokens = useAccessTokens()
  
  console.log(`tokens: ${tokens}`)

  let token = tokens[snapchatAccountId]

  if (token.get() == null) {
    const refresh_token = getRefreshToken(snapchatAccountId)
    token.set({
      expiresAt: Date.now(),
      refresh_token,
      access_token: '',
    })
  }

  if (tokenIsExpired(token.get())) {
    token.set(await refreshToken(token.refresh_token.get()))
  }

  return token.access_token.get()
}

export {
  getAccessToken
}