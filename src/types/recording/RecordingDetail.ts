export type Staff = {
  id: string
  type: string
  name: string
  artist: {
    id: string
    name: string
  }
}

export type SongWriter = {
  id: string
  type: string
  name: string
  work?: {
    relations: Array<{
      type: string
      artist: {
        id: string
        name: string
      }
    }>
  }
}

export type Player = {
  id: string
  type: string
  instrument: string
  name: string
  artist: {
    id: string
    name: string
  }
  attributes: Array<string>
}

export type Artists = {
  index: number
  artist: {
    id: string
    name: string
  }
  joinphrase: string
}

export type Credit = {
  artistCredit: Artists[]
  songWriterCredit: SongWriter[]
  staffCredit: Staff[]
  playerCredit: Player[]
}

export type RecordingData = {
  id: string
  title: string
  attribute: string
  releaseDate: string
  isrcs: Array<string>
  credit: Credit
}
