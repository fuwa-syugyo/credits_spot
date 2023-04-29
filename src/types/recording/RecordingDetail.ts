export type Staff = {
  id: string;
  type: string;
  name: string;
  artist: {
    id: string;
    name: string;
  }
}

export type SongWriter = {
  id: string;
  type: string;
  name: string;
  work?: {
    relations: Array<{
      type: string;
      artist: {
        id: string;
        name: string;
      }
    }>;
  }
}

export type Player = {
  id: string;
  type: string;
  instrument: string;
  name: string;
  artist: {
    id: string;
    name: string;
  }
  attributes: Array<string>;
}

export type Artists = {
  index: number;
  artist: {
    id: string;
    name: string;
  }
  joinphrase: string;
}

export type Credit = {
  artist_credit: Artists[];
  songwriter_credit: SongWriter[];
  staff_credit: Staff[];
  player_credit: Player[];
}

export type RecordingData = {
    id: string;
    title: string;
    attribute: string;
    release_date: string;
    isrcs: Array<string>;
    credit: Credit;
  };

