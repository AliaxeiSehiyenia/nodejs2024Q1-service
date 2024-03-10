import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../database/database';

@Injectable()
export class ArtistService {
  create(createArtistDto: CreateArtistDto) {
    this.validateNameAndGrammy(createArtistDto);

    const artistData = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy
    };
    DB.artists.push(artistData);
    return artistData;
  }

  findAll() {
    return DB.artists;
  }

  findOne(id: string) {
    return this.validateArtistId(id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    this.validateArtistId(id);
    this.validateUpdateArtist(updateArtistDto);

    const index = DB.artists.findIndex((item) => item.id === id);
    const artist = DB.artists.find((artist) => artist.id === id);

    const newArtistData = {
      ...artist,
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy
    };
    try {
      DB.artists[index] = newArtistData;
      return DB.artists[index];
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  remove(id: string) {
    this.validateArtistId(id);
    const index = DB.artists.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('This artist is not exist');

    DB.albums.map((album) => {
      if (album.artistId === id) album.artistId = null;
    });
    DB.tracks.map((track) => {
      if (track.artistId === id) track.artistId = null;
    });

    DB.artists.splice(index, 1);
    return 'Artist is found and deleted';
  }

  private validateNameAndGrammy(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;

    if (!(name && grammy)) {
      throw new BadRequestException('Invalid data');
    }
  }

  private validateArtistId(id: string) {
    const artist = DB.artists.find((item) => item.id === id);

    if (!artist) {
      throw new NotFoundException('This artist is not exist');
    }

    return artist;
  }

  private validateUpdateArtist(updateArtistDto: UpdateArtistDto) {
    const { name, grammy } = updateArtistDto;

    if (
      (!name && !grammy) ||
      (name && typeof name !== 'string') ||
      (grammy && typeof grammy !== 'boolean')
    ) {
      throw new BadRequestException('Invalid data');
    }
  }
}
