import { createState } from '@hookstate/core'

export interface AccessTokenInfo {
  expires_in: number,
  token_type: string,
  refresh_token: string,
  access_token: string,
  scope?: string,
}

export interface SnapchatUserInfo {
  id: string,
  updated_at: string,
  created_at: string,
  created_by_app_id: string,
  created_by_user: string,
  last_updated_by_app_id: string,
  last_updated_by_user: string,
  email: string,
  organization_id: string,
  display_name: string,
  member_status: string,
}

const initAccessTokenInfo: AccessTokenInfo | null = null
const initSnapchatUserInfo: SnapchatUserInfo | null = null

const snapchatAccountToAdd = createState({
  liveCode: '',
  accessTokenInfo: initAccessTokenInfo,
  snapchatUserInfo: initSnapchatUserInfo,
})

export {
  snapchatAccountToAdd
}