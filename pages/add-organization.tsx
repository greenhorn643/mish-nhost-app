import Layout from '../components/Layout'
import Head from 'next/head'
import { 
  Container,
  Info,
  Card,
  FormFields,
  FormFooter,
  InputGroup,
  InputEmailWrapper,
  Button,
} from '../components/styles/Form.styled'

import { useState } from '@hookstate/core'
import { useUserContext } from '../UserProvider';
import { gql, useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import { organizationToAdd } from '../store';
import Input from '../components/Input'

const INSERT_ORGANIZATION_MUTATION = gql`
  mutation ($organizationId: String!, $organizationName: String!, $userId: uuid!) {
    insert_snapchat_organization_one(object: {
        organization_id: $organizationId,
        organization_name: $organizationName,
        user_id: $userId
      }) {
      id
    }
  }
`

const AddOrganization = () => {
  const { user } = useUserContext();
  
  const [mutateInsertOrganization] = useMutation(INSERT_ORGANIZATION_MUTATION)

  const { organizationId, organizationName } = useState(organizationToAdd)

  const insertOrganization = async e => {
    e.preventDefault();

    try {
      await mutateInsertOrganization({
        variables: {
          organizationId: organizationId.get(),
          organizationName: organizationName.get(),
          userId: user?.id,
        }
      })
      toast.success('Organization added successfully', { id: 'insertOrganization' })
    } catch (error) {
      toast.error('Unable to add organization', { id: 'insertOrganization' })
      console.error(JSON.stringify(error))
    }
  }

  return (
    <Layout>
      <Head>
        <title>Add Organization - Nhost</title>
      </Head>

      <Container>
        <Info>
          <h2>Organizations</h2>
          <p>Add a snapchat organization to your profile.</p>
        </Info>
        <Card>
          <form onSubmit={insertOrganization}>
            <FormFields>
              <InputGroup>
                <Input
                  type="uuid"
                  label="Organization id"
                  value={organizationId.get()}
                  onChange={e => organizationId.set(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  label="Organization name"
                  value={organizationName.get()}
                  onChange={e => organizationName.set(e.target.value)}
                  required
                />
              </InputGroup>
              <InputEmailWrapper>
                <Input
                  type="text"
                  label="User"
                  value={`${user?.metadata?.firstName} ${user?.metadata?.lastName}`}
                  readOnly
                />
              </InputEmailWrapper>
              <InputEmailWrapper>
                <Input
                  type="uuid"
                  label="User id"
                  value={user?.id}
                  readOnly
                />
              </InputEmailWrapper>
            </FormFields>
            
            <FormFooter>
              <Button type="submit">
                Update
              </Button>
            </FormFooter>
          </form>
        </Card>
      </Container>
    </Layout>
  )
}

export default AddOrganization