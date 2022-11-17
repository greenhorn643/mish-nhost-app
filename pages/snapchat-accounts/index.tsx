import Layout from '../../components/Layout'
import Head from 'next/head'

import { Container, Info } from '../../components/styles/Form.styled'
import SnapchatAccount from '../../components/SnapchatAccount'
import Link from 'next/link'
import Add from '../../components/Add'
import { UrlObject } from 'url'
import { SnapchatAccountsProvider, useSnapchatAccountsContext } from '../../providers/SnapchatAccountsProvider'
const CLIENT_ID = '8426e502-e90a-4b8c-94b1-6bb3ccda8121'
const REDIRECT_URI = 'https://127.0.0.1:3001/snapchat-accounts/add'

const snapRedirectUrl = (): UrlObject => {
  const url = new URL('https://accounts.snapchat.com/login/oauth2/authorize')

  const params = {
    client_id: CLIENT_ID,
    redirect_uri: encodeURI(REDIRECT_URI),
    response_type: 'code',
    scope: 'snapchat-profile-api snapchat-offline-conversions-api snapchat-marketing-api',
  }

  url.search = new URLSearchParams(params).toString()
  return url
}

const SnapchatAccountsList = () => {
  const accounts = useSnapchatAccountsContext()
  return (
    <div>
      {accounts.map(acc => {
        return (
          <Link href={`/snapchat-accounts/${acc.id}`} key={acc.id}>
            <a>
              <SnapchatAccount
                account={acc}
              />
            </a>
          </Link>
        )
      })
      }
      <Add
        label='Add Snapchat Account'
        href={snapRedirectUrl()}
      />
    </div>
  )
}

const SnapchatAccounts = () => {

  return (
    <Layout>
      <Head>
        <title>Snapchat Accounts - Nhost</title>
      </Head>

      <Container>
        <Info>
          <h2>Snapchat Accounts</h2>
          <SnapchatAccountsProvider>
            <SnapchatAccountsList />
          </SnapchatAccountsProvider>
        </Info>
      </Container>
      
    </Layout>
  )
}

export default SnapchatAccounts