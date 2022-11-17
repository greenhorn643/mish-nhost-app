import { createState } from '@hookstate/core'

const profile = createState({
  firstName: '',
  lastName: '',
})

const organizationToAdd = createState({
  organizationId: '',
  organizationName: '',
})

const oauthAppToAdd = createState({
  appName: '',
  clientSecret: '',
  snapClientId: '',
  snapRedirectUri: '',
})


export {
  profile,
  organizationToAdd,
  oauthAppToAdd,
}