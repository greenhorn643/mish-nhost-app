import withAuth from '../withAuth'
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
import Head from 'next/head';
import Layout from '../components/Layout';
import Input from '../components/Input';
import { gql, useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import { profile } from '../store'

const UPDATE_USER_MUTATION = gql`
  mutation ($id: uuid!, $displayName: String!, $metadata: jsonb) {
    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName, metadata: $metadata }) {
      id
      displayName
      metadata
    }
  }
`

const Profile = () => {
  const { user } = useUserContext();

  const { firstName, lastName } = useState(profile)

  const [mutateUser, { loading: updatingProfile }] = useMutation(UPDATE_USER_MUTATION)

  const isFirstNameDirty = firstName !== user?.metadata?.firstName;
  const isLastNameDirty = lastName !== user?.metadata?.lastName;
  const isProfileFormDirty = isFirstNameDirty || isLastNameDirty;

  const updateUserProfile = async e => {
    e.preventDefault();

    try {
      await mutateUser({
        variables: {
          id: user.id,
          displayName: `${firstName.get()} ${lastName.get()}`.trim(),
          metadata: {
            firstName: firstName.get(),
            lastName: lastName.get(),
          }
        }
      })
      toast.success('Updated successfully', { id: 'updateProfile' })
    } catch (error) {
      toast.error('Unable to update profile', { id: 'updateProfile' })
      console.error(JSON.stringify(error))
    }
  };

  return (
    <Layout>
      <Head>
        <title>Profile - Nhost</title>
      </Head>

      <Container>
        <Info>
          <h2>Profile</h2>
          <p>Update your personal information.</p>
        </Info>
        <Card>
          <form onSubmit={updateUserProfile}>
            <FormFields>
              <InputGroup>
                <Input
                  type="text"
                  label="First name"
                  value={firstName.get()}
                  onChange={e => firstName.set(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  label="Last name"
                  value={lastName.get()}
                  onChange={e => lastName.set(e.target.value)}
                  required
                />
              </InputGroup>
              <InputEmailWrapper>
                <Input
                  type="email"
                  label="Email address"
                  value={user?.email}
                  readOnly
                />
              </InputEmailWrapper>
            </FormFields>

            <FormFooter>
              <Button
                type="submit"
                disabled={!isProfileFormDirty}
              >
                Update
              </Button>
            </FormFooter>
          </form>
        </Card>
      </Container>
    </Layout>
  );
};

export default withAuth(Profile);
