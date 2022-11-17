import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Card } from '../../../../../components/styles/Form.styled'
import { SnapchatAccountProvider } from '../../../../../providers/SnapchatAccountProvider'
import { SnapchatSavedStoryProvider, useSnapchatSavedStoriesContext } from '../../../../../providers/SnapchatSavedStoryProvider'
import { TokenProvider } from '../../../../../providers/TokenProvider'
import { SnapchatSavedStory } from '../../../../../types/SnapchatSavedStory'

interface SavedStoryProps {
  story: SnapchatSavedStory,
  snapchatAccountId: string,
  profile_id: string,
}

const SavedStory = ({ story, snapchatAccountId, profile_id }: SavedStoryProps) => {
  console.log(story.id)
  return (
    <Link href={`/snapchat-accounts/${snapchatAccountId}/public-profiles/${profile_id}/saved-stories/${story.id}`} key={story.id}>
      <Card>
        <p>Title: {story.title}</p>
        <Image src={story.thumbnail_url} width='50px' height='50px'></Image>
      </Card>
    </Link>
  )
}

interface SavedStoriesListProps {
  snapchatAccountId: string,
  profile_id: string,
}

const SavedStoriesList = (props: SavedStoriesListProps) => {
  const stories = useSnapchatSavedStoriesContext()
  return (
    <div>
      {stories.map(story => {
        return <SavedStory story={story} {...props}></SavedStory>
      })}
    </div>
  )
}

interface PublicProfileDetailProps {
  snapchatAccountId: string,
  profile_id: string,
}

const PublicProfileDetail = (props: PublicProfileDetailProps) => {
  return (
    <SavedStoriesList {...props}/>
  )
}

const PublicProfile = () => {
  const router = useRouter()

  const snapchatAccountId = router.query.id
  const profile_id = router.query.profileId

  if (typeof(snapchatAccountId) !== 'string') {
    return null
  }

  if (typeof(profile_id) !== 'string') {
    return null
  }

  return (
      <SnapchatAccountProvider snapchatAccountId={snapchatAccountId}>
        <TokenProvider>
          <SnapchatSavedStoryProvider profile_id={profile_id}>
            <PublicProfileDetail {...{snapchatAccountId, profile_id}}/>
          </SnapchatSavedStoryProvider>
        </TokenProvider>
      </SnapchatAccountProvider>
  )
}

export default PublicProfile