import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { PostType, PaginatedPosts, CreatePostInput } from './posts.types';
import { ValidationPipe, ParseUUIDPipe, BadRequestException, Logger } from '@nestjs/common';

@Resolver(() => PostType)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) { }
  private readonly logger = new Logger(PostsResolver.name);

  @Query(() => PaginatedPosts)
  async posts(
    @Args('userId', { type: () => String, nullable: true }) userId?: string, 
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize = 5,
  ) {

    this.logger.log(`Fetching posts for userId=${userId || 'all'}, page=${page}, pageSize=${pageSize}`);
    if (userId) {
      try {
        new ParseUUIDPipe({
          exceptionFactory: () => new BadRequestException('Invalid UUID format for userId'),
        }).transform(userId, { type: 'custom', metatype: String });
      } catch (err) {
        throw new BadRequestException('Invalid UUID format for userId');
      }
    }

    return this.postsService.findPosts(userId, page, pageSize);
  }

  @Mutation(() => PostType)
  async createPost(
    @Args(
      'input',
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )
    input: CreatePostInput,
  ) {
    this.logger.log(`Creating post for userId=${input.userId}, title=${input.title}`);
    return this.postsService.create(input);
  }

}
