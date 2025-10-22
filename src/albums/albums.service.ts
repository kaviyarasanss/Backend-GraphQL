import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { Album } from '../db/models/albums.model';
import { CreateAlbumInput, UpdateAlbumInput } from './albums.types';
import { User } from '../db/models/users.model';

@Injectable()
export class AlbumsService {
  private readonly logger = new Logger(AlbumsService.name);
  
  async findAlbums(userId?: string, page = 1, pageSize = 5) {
    this.logger.log(`Fetching albums for userId=${userId || 'all'}, page=${page}, pageSize=${pageSize}`);
    const offset = (page - 1) * pageSize;
  
    let query = Album.query();
  
    if (userId) {
      const user = await User.query().findById(userId);
      if (!user){
        this.logger.warn(`User with ID=${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      query = query.where('user_id', userId);
    }

    const albums: any = await query
      .select('albums.*')
      .select(Album.knex().raw('COUNT(*) OVER() AS total_count'))
      .offset(offset)
      .limit(pageSize);

    const total = albums[0]?.total_count ?? 0;

    const data = albums.map(album => ({
      id: album.id,
      userId: album.user_id,
      name: album.name,
      description: album.description ?? null,
      genre: album.genre ?? null,
    }));
  
    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async create(input: CreateAlbumInput) {
    this.logger.log(`Creating album "${input.name}" for userId=${input.userId}`);
    const user = await User.query().findById(input.userId);
    if (!user) {
      this.logger.warn(`User with ID ${input.userId} not found`);
      throw new NotFoundException(`User with ID ${input.userId} not found`);
    }

    try {
      const album = await Album.query().insert({
        user_id: input.userId,
        name: input.name,
        description: input.description || null,
        genre: input.genre || null,
      });

      return {
        id: album.id,
        userId: album.user_id,
        name: album.name,
        description: album.description,
        genre: album.genre,
      };
    } catch (err) {
      this.logger.error('Error creating album: ' + err?.message );
      throw new BadRequestException('Failed to create album');
    }
  }

  async update(input: UpdateAlbumInput) {
    this.logger.log(`Updating album with ID=${input.id}`);
    const album = await Album.query().findById(input.id);
    if (!album) {
      this.logger.warn(`Album with ID=${input.id} not found`);
      throw new NotFoundException(`Album with ID ${input.id} not found`);
    }

    try {
      const updated = await Album.query().patchAndFetchById(input.id, {
        name: input.name ?? album.name,
        description: input.description ?? album.description,
        genre: input.genre ?? album.genre,
      });

      return {
        id: updated.id,
        userId: updated.user_id,
        name: updated.name,
        description: updated.description,
        genre: updated.genre,
      };
    } catch (err) {
      this.logger.error('Error updating album: ' + err?.message );
      throw new BadRequestException('Failed to update album');
    }
  }

  async delete(id: string) {
    this.logger.log(`Deleting album with ID=${id}`);
    const album = await Album.query().findById(id);
    if (!album) {
      this.logger.warn(`Album with ID=${id} not found`);
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    try {
      await Album.query().deleteById(id);
      return true;
    } catch (err) {
      this.logger.error('Error deleting album: ' + err?.message );
      throw new BadRequestException('Failed to delete album');
    }
  }
}
