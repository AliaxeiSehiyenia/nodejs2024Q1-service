import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DB } from '../database/database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    this.validateArtistAndAlbumByCreate(createTrackDto);

    const trackData = {
      id: uuidv4(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto?.artistId || null,
      albumId: createTrackDto?.albumId || null
    };
    DB.tracks.push(trackData);
    return trackData;
  }

  findAll() {
    return DB.tracks;
  }

  findOne(id: string) {
    return this.validateTrackId(id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    this.validateTrackId(id);
    this.validateArtistAndAlbumByUpdate(updateTrackDto);

    const index = DB.tracks.findIndex((item) => item.id === id);
    const updatedTrack = { ...DB.tracks[index], ...updateTrackDto };
    DB.tracks[index] = updatedTrack;

    return updatedTrack;
  }

  remove(id: string) {
    this.validateTrackId(id);
    const index = DB.tracks.findIndex((item) => item.id === id);
    DB.tracks.splice(index, 1);
    return 'Track is found and deleted';
  }

  private validateArtistAndAlbumByCreate(createTrackDto: CreateTrackDto) {
    const { name, artistId, albumId, duration } = createTrackDto;

    if (artistId && (typeof artistId !== 'string' || artistId.trim() === '')) {
      throw new BadRequestException('Artist ID must be a non-empty string');
    }

    if (albumId && (typeof albumId !== 'string' || albumId.trim() === '')) {
      throw new BadRequestException('Album ID must be a non-empty string');
    }

    if (typeof name !== 'string' || name.trim() === '') {
      throw new BadRequestException('Name must be a non-empty string');
    }

    if (typeof duration !== 'number' || isNaN(duration)) {
      throw new BadRequestException('Duration must be a number');
    }
  }

  private validateArtistAndAlbumByUpdate(updateTrackDto: UpdateTrackDto) {
    const { name, artistId, albumId, duration } = updateTrackDto;

    if (artistId && (typeof artistId !== 'string' || artistId.trim() === '')) {
      throw new BadRequestException('Artist ID must be a non-empty string');
    }

    if (albumId && (typeof albumId !== 'string' || albumId.trim() === '')) {
      throw new BadRequestException('Album ID must be a non-empty string');
    }

    if (name && (typeof name !== 'string' || name.trim() === '')) {
      throw new BadRequestException('Name must be a non-empty string');
    }

    if (duration && (typeof duration !== 'number' || isNaN(duration))) {
      throw new BadRequestException('Duration must be a number');
    }
  }

  private validateTrackId(id: string) {
    const track = DB.tracks.find((item) => item.id === id);

    if (!track) {
      throw new NotFoundException('This track is not exist');
    }

    return track;
  }
}
