export type ArtistCredit = {
  id: string
  name: string
  artist: {
    id: string
    name: string
  }
  joinphrase: string
  allName: string
}
export type secondaryType = {
  'release-group': {
    'secondary-types': Array<string>
  }
}

export type SearchRecordingData = {
  id: string
  title: string
  'artist-credit': ArtistCredit[]
  'first-release-date': string
  firstReleaseDate: string
  releases: secondaryType[]
  'secondary-types': string
}
