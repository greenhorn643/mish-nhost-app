import Image from 'next/image'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { Card } from '../../../../../../components/styles/Form.styled'
import { SnapchatAccountProvider } from '../../../../../../providers/SnapchatAccountProvider'
import { SnapchatSavedStorySnapsProvider, useSnapchatSavedStorySnapsContext } from '../../../../../../providers/SnapchatSavedStorySnapsProvider'
import { TokenProvider } from '../../../../../../providers/TokenProvider'
import { SnapchatSavedStorySnap } from '../../../../../../types/SnapchatSavedStorySnap'

const SavedStorySnap = ({ snap }: { snap: SnapchatSavedStorySnap }) => {
  return (
    <Link href={snap.media_metadata.media_url}>
      <Card>
        <Image src={snap.media_metadata.thumbnail_url} width='50px' height='50px'></Image>
      </Card>
    </Link>
  )
}

const SavedStorySnapsList = () => {
  const snaps = useSnapchatSavedStorySnapsContext()
  return (
    <div>
      {snaps.map(snap => {
        return <SavedStorySnap snap={snap}></SavedStorySnap>
      })}
    </div>
  )
}

const PublicProfileDetail = () => {
  return (
    <SavedStorySnapsList />
  )
}

const extractPathProps = (router: NextRouter): {
  snapchatAccountId: string,
  profileId: string,
  savedStoryId: string
} => {
  const path = router.asPath
  const pathItems = path.split('/')
  console.log(pathItems)
  return {
    snapchatAccountId: pathItems[2],
    profileId: pathItems[4],
    savedStoryId: pathItems[6],
  }
}

const SnapchatSavedStory = () => {
  const router = useRouter()

  const {
    snapchatAccountId,
    profileId,
    savedStoryId,
  } = extractPathProps(router)

  console.log(router.asPath)

  if (typeof (snapchatAccountId) !== 'string') {
    console.log(`snapchatAccountId is null`)
    return null
  }

  if (typeof (profileId) !== 'string') {
    console.log(`profileId is null`)
    return null
  }

  if (typeof (savedStoryId) !== 'string') {
    console.log(`savedStoryId is null`)
    return null
  }

  return (
    <SnapchatAccountProvider snapchatAccountId={snapchatAccountId}>
      <TokenProvider>
        <SnapchatSavedStorySnapsProvider profile_id={profileId} saved_story_id={savedStoryId}>
          <PublicProfileDetail />
        </SnapchatSavedStorySnapsProvider>
      </TokenProvider>
    </SnapchatAccountProvider>
  )
}

export default SnapchatSavedStory