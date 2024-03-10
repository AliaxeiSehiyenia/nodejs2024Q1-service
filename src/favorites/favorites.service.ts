import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DB } from '../database/database';

@Injectable()
export class FavoritesService {

  getFavorites() {
    const tracks = [];
    const albums = [];
    const artists = [];

    DB.favorites.tracks.map((id) => {
      const track = DB.tracks.find((track) => track.id === id);
      if (track) {
        tracks.push(track);
      }
    });

    DB.favorites.albums.map((id) => {
      const album = DB.albums.find((album) => album.id === id);
      if (album) {
        albums.push(album);
      }
    });

    DB.favorites.artists.map((id) => {
      const artist = DB.artists.find((artist) => artist.id === id);
      if (artist) {
        artists.push(artist);
      }
    });

    return {
      tracks,
      albums,
      artists
    };
  }

  addAlbum(id: string) {
    const index = DB.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new UnprocessableEntityException();
    }
    DB.favorites.albums.push(id);
    return index;
  }

  addTrack(id: string) {
    const index = DB.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new UnprocessableEntityException();
    }
    DB.favorites.tracks.push(id);
    return index;
  }

  addArtist(id: string) {
    const index = DB.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new UnprocessableEntityException();
    }
    DB.favorites.artists.push(id);
    return index;
  }

  deleteAlbum(id: string) {
    const index = DB.favorites.albums.findIndex((e) => e === id);
    if (index === -1) {
      throw new NotFoundException('Favorites doesn\'t contain this album');
    }
    DB.favorites.albums = DB.favorites.albums.filter((album) => album !== id);
    return;
  }

  deleteTrack(id: string) {
    const index = DB.favorites.tracks.findIndex((e) => e === id);
    if (index === -1) {
      throw new NotFoundException('Favorites doesn\'t contain this track');
    }
    DB.favorites.tracks = DB.favorites.tracks.filter((track) => track !== id);
    return 'This track deleted';
  }

  deleteArtist(id: string) {
    const index = DB.favorites.artists.findIndex((e) => e === id);
    if (index === -1) {
      throw new NotFoundException('Favorites doesn\'t contain this track');
    }
    DB.favorites.artists = DB.favorites.artists.filter((artist) => artist !== id);
    return;
  }
}
