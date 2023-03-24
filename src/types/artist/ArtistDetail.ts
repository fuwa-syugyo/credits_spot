export type RecordingCredit = {
  type: string;
  recording: {
    id: string;
    title: string;
  }
  "target-type": string;
}

export type SongWriterCredit = {
  type: string;
  work: {
    id: string;
    title: string;
  }
  "target-type": string;
}

export type ArtistData = {
  id: string;
  name: string;
  credit: {
    song_writer_credit: SongWriterCredit[];
    recording_credit: RecordingCredit[];
  }
}

export type ArtistCredit = {
  id: string;
  name: string;
  artist: {
    id: string;
    name: string;
  }
  joinphrase: string;
  all_name: string;
}

export type RecordInWork = {
  recording: {
    id: string;
    title: string;
    "artist-credit": ArtistCredit[];
  }
  attributes: Array<string>;
}

