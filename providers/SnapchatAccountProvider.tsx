import React, { useContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import { SnapchatAccount } from '../types/SnapchatAccount'

const GET_SNAPCHAT_ACCOUNT_QUERY = gql`
  query ($snapchatAccountId: uuid!) {
    snapchat_account_by_pk(id: $snapchatAccountId) {
      created_at
      id
      refresh_token
      updated_at
      user_id
      snap_name
    }
  } 
`
const SnapchatAccountContext = React.createContext(null)

interface Props {
  snapchatAccountId: string,
  children: JSX.Element,
}

export const SnapchatAccountProvider = ({ snapchatAccountId, children = null }: Props) => {
  const { loading, error, data } = useQuery(GET_SNAPCHAT_ACCOUNT_QUERY, {
    variables: { snapchatAccountId }
  })

  if (error) {
    console.log(error.message)
    return <p>Something went wrong: {error.message} Try to refresh the page.</p>
  }
  if (loading) {
    return null
  }
  
  const snapchatAccount = data.snapchat_account_by_pk

  return (
    <SnapchatAccountContext.Provider
      value={snapchatAccount}>
      {children}
    </SnapchatAccountContext.Provider>
  )
}

export const useSnapchatAccountContext = (): SnapchatAccount => {
  return useContext(SnapchatAccountContext)
}