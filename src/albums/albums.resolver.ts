import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AlbumsService } from './albums.service';
import { AlbumType, PaginatedAlbums, CreateAlbumInput, UpdateAlbumInput } from './albums.types';
import { ValidationPipe, ParseUUIDPipe, BadRequestException, Logger } from '@nestjs/common';

@Resolver(() => AlbumType)
export class AlbumsResolver {
  private readonly logger = new Logger(AlbumsResolver.name);
  constructor(private readonly albumsService: AlbumsService) {}

  @Query(() => PaginatedAlbums)
  async albums(
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize = 5,
  ) {
    this.logger.log(`Fetching albums for userId=${userId || 'all'}, page=${page}, pageSize=${pageSize}`);
    if (userId) {
      try {
        new ParseUUIDPipe({
          exceptionFactory: () => new BadRequestException('Invalid UUID format for userId'),
        }).transform(userId, { type: 'custom', metatype: String });
      } catch (err) {
        throw new BadRequestException('Invalid UUID format for userId');
      }
    }
      
    return this.albumsService.findAlbums(userId, page, pageSize);
  }

  @Mutation(() => AlbumType)
  async createAlbum(
    @Args('input', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    input: CreateAlbumInput,
  ) {
    this.logger.log(`Creating album with name=${input.name} for userId=${input.userId}`);
    return this.albumsService.create(input);
  }

  @Mutation(() => AlbumType)
  async updateAlbum(
    @Args('input', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    input: UpdateAlbumInput,
  ) {
    this.logger.log(`Updating album with ID=${input.id}`);
    return this.albumsService.update(input);
  }

  @Mutation(() => Boolean)
  async deleteAlbum(@Args('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Deleting album with ID=${id}`);
    return this.albumsService.delete(id);
  }
}
