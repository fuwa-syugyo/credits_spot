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

export type Engineer = {
  id: string;
  job: string;
  type: string;
  name: string;
  artist: {
    id: string;
    name: string;
    disambiguation: string;
  }
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
  engineer_credit: Engineer[];
}

export type RecordingData = {
    id: string;
    title: string;
    attribute: string;
    release_date: string;
    credit: Credit;
  };

