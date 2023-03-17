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

