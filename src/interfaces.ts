export interface IUser {
  id: string;
  login: string;
  password: string;
  version: number; // integer number, incremented on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}

export interface ITrack {
  id: string;
  name: string;
  artistId: string | null; // reference to Artist
  albumId: string | null; // reference to Album
  duration: number; // integer number
}

export interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null; // reference to Artist
}