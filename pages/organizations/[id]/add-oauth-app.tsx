import { useRouter } from 'next/router'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useUserContext } from '../../../UserProvider'
import { useState } from '@hookstate/core'
import { oauthAppToAdd } from '../../../store'
import toast from 'react-hot-toast'
import Layout from '../../../components/Layout'
import Head from 'next/head'
import Input from '../../../components/Input'
import { 
  Container,
  Info,
  Card,
  FormFields,
  InputGroup,
  InputEmailWrapper,
  FormFooter,
  Button,
} from '../../../components/styles/Form.styled'

const INSERT_ORGANIZATION_MUTATION = gql`
  mutation (
    $appName: String!,
    $clientSecret: String!,
    $snapClientId: String!,
    $snapOrganizationId: uuid!
    $snapRedirectUri: String!,
    $userId: uuid!) {
    insert_snapchat_oauth_app_one(object: {
        app_name: $appName
        client_secret: $clientSecret
        snap_client_id: $snapClientId
        snap_organization_id: $snapOrganizationId
        snap_redirect_uri: $snapRedirectUri
        user_id: $userId
      }) {
      id
    }
  }
`

const GET_ORGANIZATION_NAME_QUERY = gql`
  query ($snapOrganizationId: uuid!) {
    snapchat_organization_by_pk(id: $snapOrganizationId) {
      organization_name
    }
  }
`

const AddOAuthApp = () => {
  const router = useRouter()
  const id = router.query.id

  const { user } = useUserContext()
  
  const [mutateInsertOrganization] = useMutation(INSERT_ORGANIZATION_MUTATION)

  const { loading, error, data } = useQuery(GET_ORGANIZATION_NAME_QUERY, {
    variables: { snapOrganizationId: id }
  })

  const {
    appName,
    clientSecret,
    snapClientId,
    snapRedirectUri,
  } = useState(oauthAppToAdd)

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error! {error.message}</p>
  }

  const snapOrganizationName: string = data.snapchat_organization_by_pk.organization_name

  console.log(`data: ${JSON.stringify(data)}`)

  const insertOAuthApp = async e => {
    e.preventDefault();

    try {
      await mutateInsertOrganization({
        variables: {
          appName: appName.get(),
          clientSecret: clientSecret.get(),
          snapClientId: snapClientId.get(),
          snapOrganizationId: id,
          snapRedirectUri: snapRedirectUri.get(),
          userId: user?.id,
        }
      })
      toast.success('OAuth app added successfully', { id: 'insertOAuthApp' })
    } catch (error) {
      toast.error('Unable to add OAuth app', { id: 'insertOAuthApp' })
      console.error(JSON.stringify(error))
    }
  }

  return (
    <Layout>
      <Head>
        <title>Add OAuth App - Nhost</title>
      </Head>
      <Container>
        <Info>
          <h2>Add OAuth App</h2>
          <p>Add an OAuth app to your organization.</p>
        </Info>

        <Card>
          <form onSubmit={insertOAuthApp}>
            <FormFields>
              <InputGroup>
                <Input
                  type="text"
                  label="Organization name"
                  defaultValue={snapOrganizationName}
                  disabled
                />
                <Input
                  type="uuid"
                  label="Organization id"
                  defaultValue={id}
                  disabled
                />
                </InputGroup>
                <InputEmailWrapper>
                  <Input
                    type="text"
                    label="App name"
                    value={appName.get()}
                    onChange={e => appName.set(e.target.value)}
                    required
                  />
                </InputEmailWrapper>
                <InputEmailWrapper>
                  <Input
                    type="text"
                    label="Client secret"
                    value={clientSecret.get()}
                    onChange={e => clientSecret.set(e.target.value)}
                    required
                  />
                </InputEmailWrapper>
                <InputEmailWrapper>
                  <Input
                    type="uuid"
                    label="Client id"
                    value={snapClientId.get()}
                    onChange={e => snapClientId.set(e.target.value)}
                    required
                  />
                </InputEmailWrapper>
                <InputEmailWrapper>
                  <Input
                    type="text"
                    label="Redirect uri"
                    value={snapRedirectUri.get()}
                    onChange={e => snapRedirectUri.set(e.target.value)}
                    required
                  />
                </InputEmailWrapper>
            </FormFields>

            <FormFooter>
              <Button
                type="submit"
              >
                Add
              </Button>
            </FormFooter>
          </form>
        </Card>
      </Container>
    </Layout>
  )
}

export default AddOAuthApp