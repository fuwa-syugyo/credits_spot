export type ArtistCredit = {
  id: string;
  name: string;
}

export type SearchRecordingData  = {
  id: string;
  title: string;
  "artist-credit": ArtistCredit[];
  "first-release-date": string;
  artist: {
    id: string;
    name: string;
  }
  first_release_date: string;
  };
