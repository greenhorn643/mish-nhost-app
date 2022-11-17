import { gql, useMutation } from '@apollo/client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Button, Card, Container } from '../../../components/styles/Form.styled'
import { Input, Label } from '../../../components/styles/Input.styled'
import { SnapchatAccountProvider, useSnapchatAccountContext } from '../../../providers/SnapchatAccountProvider'
import { SnapchatOrganizationsProvider, useSnapchatOrganizationsContext } from '../../../providers/SnapchatOrganizationsProvider'
import { SnapchatPublicProfilesProvider, useSnapchatPublicProfilesContext } from '../../../providers/SnapchatPublicProfileProvider'
import { TokenProvider } from '../../../providers/TokenProvider'
import { SnapchatOrganization } from '../../../types/SnapchatOrganization'
import { SnapchatPublicProfile } from '../../../types/SnapchatPublicProfile'

const DELETE_SNAPCHAT_ACCOUNT_MUTATION = gql`
  mutation ($id: uuid!) {
    delete_snapchat_account_by_pk(id: $id) {
      id
    }
  }
`

const PublicProfile = ({ profile }: { profile: SnapchatPublicProfile }) => {
  const snapchatAccountId = useSnapchatAccountContext().id
  return (
    <Link href={`/snapchat-accounts/${snapchatAccountId}/public-profiles/${profile.id}`} key={profile.id}>
      <Card>
        <p>Profile Display Name: {profile.display_name}</p>
        <p>Snap User Name: {profile.snap_user_name}</p>
        <p>Profile Type: {profile.profile_type}</p>
        <Image src={profile.logo_urls.original_logo_url} width='50px' height='50px'></Image>
      </Card>
    </Link>
  )
}

const PublicProfilesList = () => {
  const profiles = useSnapchatPublicProfilesContext()
  return (
    <div>
      {profiles.map(profile => {
        return <PublicProfile profile={profile}></PublicProfile>
      })}
    </div>
  )
}

const Organization = ({ org }: { org: SnapchatOrganization }) => {
  return (
    <Container>
      <Card>
        <Label>Organization Name</Label>
        <Input type='text' defaultValue={org.name} readOnly/>
        <Label>Organization Id</Label>
        <Input type='uuid' defaultValue={org.id} readOnly/>
        <Label>Country</Label>
        <Input type='uuid' defaultValue={org.country} readOnly/>
        <Label>Contact Name</Label>
        <Input type='uuid' defaultValue={org.contact_name} readOnly/>
        <Label>Contact Email</Label>
        <Input type='uuid' defaultValue={org.contact_email} readOnly/>
        <Label>My Display Name</Label>
        <Input type='uuid' defaultValue={org.my_display_name} readOnly/>
        <Label>Public Profiles</Label>
          <SnapchatPublicProfilesProvider organization_id={org.id}>
            <PublicProfilesList />
          </SnapchatPublicProfilesProvider>
      </Card>
    </Container>
  )
}

const OrganizationsList = () => {
  const orgs = useSnapchatOrganizationsContext()

  return (
    <div>
      {orgs.map(org => {
        return <Organization org={org} key={org.id}/>
      })
      }
    </div>
  )
}

const SnapchatAccountDetail = () => {
  return (
      <TokenProvider>
        <SnapchatOrganizationsProvider>
          <OrganizationsList/>
        </SnapchatOrganizationsProvider>
      </TokenProvider>
  )
}

const SnapchatAccount = () => {
  const router = useRouter()

  const snapchatAccountId = router.query.id

  const [mutateDeleteSnapchatAccount] = useMutation(DELETE_SNAPCHAT_ACCOUNT_MUTATION)

  if (typeof(snapchatAccountId) !== 'string') {
    return null
  }

  const deleteSnapchatAccount = async e => {
    e.preventDefault()

    try {
      await mutateDeleteSnapchatAccount({
        variables: {
          id: snapchatAccountId,
        }
      })
      toast.success('Snapchat account removed successfully', { id: 'deleteSnapchatAccount' })
      await router.push('/snapchat-accounts')
      router.reload()
    } catch (error) {
      toast.error(`Unable to remove Snapchat account: ${JSON.stringify(error)}`, { id: 'deleteSnapchatAccount'})
      console.error(JSON.stringify(error))
    }
  }

  return (
    <div>
      <SnapchatAccountProvider snapchatAccountId={snapchatAccountId}>
        <SnapchatAccountDetail />
      </SnapchatAccountProvider>
      <Button onClick={deleteSnapchatAccount}>
        Remove Account
      </Button>
    </div>
  )
}

export default SnapchatAccount