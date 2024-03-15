import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DB } from '../database/database';
import { v4 as uuidv4, validate } from 'uuid';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    this.validateAlbum(createAlbumDto);

    const validatedArtistId =
      createAlbumDto.artistId && DB.artists.find((a) => a.id === createAlbumDto.artistId)
        ? createAlbumDto.artistId
        : null;

    const albumData = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: validatedArtistId
    };
    DB.albums.push(albumData);
    return albumData;
  }

  findAll() {
    return DB.albums;
  }

  findOne(id: string) {
    return this.validateAlbumId(id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    this.validateAlbumId(id);
    this.validateAlbum(updateAlbumDto);

    const index = DB.albums.findIndex((album) => album.id === id);
    const album = DB.albums[index];
    const validatedArtistId =
      updateAlbumDto.artistId &&
      DB.artists.find((a) => a.id === updateAlbumDto.artistId)
        ? updateAlbumDto.artistId
        : null;
    const newAlbumData = {
      id: album.id,
      name: updateAlbumDto.name || album.name,
      year: updateAlbumDto.year || album.year,
      artistId: validatedArtistId
    };

    DB.albums[index] = newAlbumData;
    return DB.albums[index];
  }

  remove(id: string) {
    this.validateAlbumId(id);
    const index = DB.albums.findIndex((item) => item.id === id);
    DB.tracks.map((track) => {
      if (track.albumId === id) track.albumId = null;
    });
    DB.albums.splice(index, 1);
    return 'Album is found and deleted';
  }

  private validateAlbum(albumDto: CreateAlbumDto | UpdateAlbumDto) {
    const { name, artistId, year } = albumDto;

    if (!albumDto || typeof name !== 'string' || typeof year !== 'number') {
      throw new BadRequestException('New album invalid');
    }

    if (typeof artistId !== 'string' && artistId !== null) {
      throw new BadRequestException('Artist for new album invalid');
    }
  }

  private validateAlbumId(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Id is invalid');
    }

    const album = DB.albums.find((item) => item.id === id);

    if (!album) {
      throw new NotFoundException('This album is not exist'); // 404
    }

    return album;
  }
}
