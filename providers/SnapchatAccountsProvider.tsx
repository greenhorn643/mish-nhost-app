import React, { useContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useUserId } from '@nhost/nextjs'
import { SnapchatAccount } from '../types/SnapchatAccount'

const GET_SNAPCHAT_ACCOUNTS_QUERY = gql`
  query GetSnapchatAccounts($id: uuid!) {
    snapchat_account(where: { user_id: { _eq: $id }}) {
      created_at
      id
      refresh_token
      updated_at
      user_id
      snap_name
    }
  }
`

const SnapchatAccountsContext = React.createContext(null)

export const SnapchatAccountsProvider = ({ children = null }) => {
  const userId = useUserId()
  const { loading, error, data } = useQuery(GET_SNAPCHAT_ACCOUNTS_QUERY, {
    variables: { id: userId }
  })

  if (error) {
    return <p>Something went wrong: {error.message}. Try to refresh the page.</p>
  }
  if (loading) {
    return null
  }
  
  const snapchatAccounts: SnapchatAccount[] = data.snapchat_account

  return (
    <SnapchatAccountsContext.Provider
      value={snapchatAccounts}>
      {children}
    </SnapchatAccountsContext.Provider>
  )
}

export const useSnapchatAccountsContext = (): SnapchatAccount[] => {
  return useContext(SnapchatAccountsContext)
}