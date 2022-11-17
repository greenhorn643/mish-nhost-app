import Layout from '../../components/Layout'
import Head from 'next/head'

import { Container, Info } from '../../components/styles/Form.styled'

import { gql, useQuery } from '@apollo/client'
import { useUserContext } from '../../UserProvider'
import Organization from '../../components/Organization'
import Link from 'next/link'

const GET_ORGANIZATIONS_QUERY = gql`
  query get_organizations($userId: uuid!) {
    snapchat_organization (where: { user_id: { _eq: $userId }}) {
      id
      user_id
      organization_id
      organization_name
    }
  }
`

const Organizations = () => {

  const { user } = useUserContext()

  const OrganizationsList = () => {

    if (!user?.id) {
      return <p>Loading...</p>
    }

    const { loading, error, data } = useQuery(GET_ORGANIZATIONS_QUERY, {
      variables: { userId: user?.id }
    })

    if (loading) return <p>Loading...</p>
    if (error) return <p>{`Error! ${error.message}`}</p>
    return (
      <div>
      {data.snapchat_organization.map(org => {
        return (
          <Link href={`/organizations/${org.id}`}>
            <a>
              <Organization
                organization_id={org.organization_id}
                organization_name={org.organization_name}
              />
            </a>
          </Link>
        )
      })
      }
      </div>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Organizations - Nhost</title>
      </Head>

      <Container>
        <Info>
          <h2>Organizations</h2>
          <OrganizationsList />
        </Info>
      </Container>
      
    </Layout>
  )
}

export default Organizations