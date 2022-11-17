export interface SnapchatPublicProfile {
  id: string,
  organization_id: string,
  display_name: string,
  logo_urls: {
    original_logo_url: string,
    discover_feed_logo_url: string,
    mega_profile_logo_url: string,
    manage_profile_logo_url: string,
  },
  snap_user_name: string,
  profile_type: string,
  profile_tier: string,
  internal_profile_category: string,
}