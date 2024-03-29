export type RecordingCredit = {
  attributes: Array<string>
  type: string
  recording: {
    id: string
    title: string
    'artist-credit': ArtistCredit[]
  }
  'artist-credit': ArtistCredit[]
  'target-type': string
}

export type SongWriterCredit = {
  type: string
  work: {
    id: string
    title: string
  }
  'target-type': string
}

export type ArtistData = {
  id: string
  name: string
  credit: {
    song: SongWriterCredit[]
    recording: RecordingCredit[]
  }
}

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

export type RecordInWork = {
  recording: {
    id: string
    title: string
    'artist-credit': ArtistCredit[]
  }
  id: string
  title: string
  attributes: Array<string>
  'artist-credit': ArtistCredit[]
}

export type ArtistRecording = {
  id: string
  title: string
}
