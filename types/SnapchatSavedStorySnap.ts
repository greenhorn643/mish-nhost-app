export interface SnapchatSavedStorySnap {
  id: string,
  story_id: string,
  media_metadata: {
    media_type: string,
    media_url: string,
    thumbnail_url: string,
  },
  created_at: string,
}