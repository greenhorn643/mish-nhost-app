import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import OAuthApp from '../../../components/OAuthApp'
import Add from '../../../components/Add'
import Layout from '../../../components/Layout'
import Head from 'next/head'
import { 
  Container,
  Info,
  Card,
  FormFields,
} from '../../../components/styles/Form.styled'

const GET_ORGANIZATION_QUERY = gql`
  query get_organization($id: uuid!) {
    snapchat_organization (where: { id: { _eq: $id }}) {
      id
      user_id
      organization_id
      organization_name
    }
  }
`

const GET_OAUTH_APPS_QUERY = gql`
  query get_oauth_app($snapOrganizationId: uuid!) {
    snapchat_oauth_app (where: { snap_organization_id: { _eq: $snapOrganizationId }}) {
      id
      user_id
      app_name
      snap_client_id
      snap_organization_id
      snap_redirect_uri
    }
  }
`

const OAuthAppList = ({ id, ...props }) => {
  const { loading, error, data } = useQuery(GET_OAUTH_APPS_QUERY, {
    variables: { snapOrganizationId: id }
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>{`Error! ${error.message}`}</p>

  console.log(`data: ${JSON.stringify(data)}`)

  return (
    <div>
      {data.snapchat_oauth_app.length === 0
        ? <Add
            label='Add OAuth App'
            href={`/organizations/${id}/add-oauth-app/`}
          />
        : data.snapchat_oauth_app.map(app => {
        return (
          <OAuthApp
            app_name={app.app_name}
            snap_client_id={app.snap_client_id}
            snap_redirect_uri={app.snap_redirect_uri}
          />
        )
      })}
    </div>
  )
}

function OrganizationDetail() {
  const router = useRouter()
  const id = router.query.id

  const { loading, error, data } = useQuery(GET_ORGANIZATION_QUERY, {
    variables: { id }
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>{`Error! ${error.message}`}</p>

  if (data.snapchat_organization.length !== 1) {
    return <p>{`Error! Snapchat Organization not found`}</p>
  }

  const {
    organization_name,
  } = data.snapchat_organization[0]

  return (
    <Layout>
      <Head>
        <title>Organization - Nhost</title>
      </Head>

      <Container>
        <Info>
          <h1>{organization_name}</h1>
          <p>Snapchat organization</p>
        </Info>
        <Card>
          <FormFields>
            <Info>
                OAuth App
            </Info>
            <OAuthAppList id={id} />
          </FormFields>
        </Card>
      </Container>
    </Layout>
  )
}

export default OrganizationDetail