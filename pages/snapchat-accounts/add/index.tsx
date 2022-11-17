import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useState } from '@hookstate/core'
import Layout from '../../../components/Layout'
import Head from 'next/head'
import { Button, Card, Container, FormFields, FormFooter, Info, InputGroup } from '../../../components/styles/Form.styled'
import Input from '../../../components/Input'
import { AccessTokenInfo, SnapchatUserInfo, snapchatAccountToAdd } from './store'
import { Persistence } from '@hookstate/persistence'
import toast from 'react-hot-toast'
import { gql, useMutation } from '@apollo/client'
import { useUserContext } from '../../../UserProvider'

const getSnapchatAccessToken = async (code: string): Promise<AccessTokenInfo> => {
  const url = new URL('https://jhnrydwjrtzlshxlceiw.nhost.run/v1/functions/get-snapchat-access-token')
  url.search = new URLSearchParams({ code }).toString()

  const res = await fetch(url)

  if (res.status !== 200) {
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  return JSON.parse(await res.text()) as AccessTokenInfo
}

const getSnapchatUserInfo = async (tokenInfo: AccessTokenInfo): Promise<SnapchatUserInfo> => {
  const url = new URL(`https://adsapi.snapchat.com/v1/me`)
 
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokenInfo.access_token}`
    }
  })

  if (res.status !== 200) {
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  const result = (await res.json()).me as SnapchatUserInfo
  console.log(`snapchat user info: ${JSON.stringify(result)}`)
  return result
}

const INSERT_SNAPCHAT_ACCOUNT_MUTATION = gql`
  mutation (
    $user_id: uuid!,
    $refresh_token: String!,
    $snap_name: String!) {
    insert_snapchat_account_one(object: {
        user_id: $user_id
        refresh_token: $refresh_token
        snap_name: $snap_name
      }) {
      id
    }
  }
`

const AddSnapchatAccountCode = () => {
  const { user } = useUserContext()
  const router = useRouter()
  const state = useState(snapchatAccountToAdd)
  state.attach(Persistence('snapchatAccountToAdd'))
  const { accessTokenInfo, snapchatUserInfo, liveCode } = state

  const [mutateInsertSnapchatAccount] = useMutation(INSERT_SNAPCHAT_ACCOUNT_MUTATION)

  const code = router.query.code

  useEffect(() => {
    if (typeof(code) === 'string' && code !== liveCode.get()) {
      liveCode.set(code);
      (async () => {
        const tokenInfo = await getSnapchatAccessToken(code)
        const userInfo = await getSnapchatUserInfo(tokenInfo)
        snapchatUserInfo.set(userInfo)
        accessTokenInfo.set(tokenInfo)
      })()
    }
  }, [code])
  
  const insertSnapchatAccount = async e => {
    e.preventDefault()

    try {
      await mutateInsertSnapchatAccount({
        variables: {
          user_id: user.id,
          refresh_token: accessTokenInfo.refresh_token.get(),
          snap_name: snapchatUserInfo.display_name.get(),
        }
      })
      toast.success('Snapchat account added successfully', { id: 'insertSnapchatAccount' })
    } catch (error) {
      toast.error(`Unable to add Snapchat account: ${JSON.stringify(error)}`, { id: 'insertSnapchatAccount'})
      console.error(JSON.stringify(error))
    }
  }
  
  return (
    <Layout>
      <Head>
        <title>Add Snapchat Account - Nhost</title>
      </Head>
      <Container>
        <Info>
          <h2>Add Snapchat Account</h2>
          <p>This snapchat account will be added to your profile</p>
        </Info>
        {accessTokenInfo.get() == null
          ? <p>Loading...</p>
          :  <Card>
              <form onSubmit={insertSnapchatAccount}>
                <FormFields>
                  <InputGroup>
                      <Input
                        type="text"
                        label="Snapchat Username"
                        defaultValue={snapchatUserInfo.display_name.get()}
                        disabled
                      />
                    </InputGroup>
                </FormFields>

                <FormFooter>
                  <Button type="submit">
                    Add Account
                  </Button>
                </FormFooter>
              </form>
            </Card>
        }
      </Container>
    </Layout>
  )
}

export default AddSnapchatAccountCode