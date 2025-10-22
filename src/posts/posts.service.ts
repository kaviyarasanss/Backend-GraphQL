import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Post } from '../db/models/posts.model';
import { User } from '../db/models/users.model';
import { CreatePostInput } from './posts.types';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  async findPosts(userId?: string, page = 1, pageSize = 5) {
    this.logger.log(`Fetching posts for userId=${userId || 'all'}, page=${page}, pageSize=${pageSize}`);
    const offset = (page - 1) * pageSize;
  
    let query = Post.query();
  
    if (userId) {
      const user = await User.query().findById(userId);
      if (!user) {
         this.logger.warn(`User with ID ${userId} not found`);
         throw new NotFoundException(`User with ID ${userId} not found`);
      }
      query = query.where('user_id', userId);
    }
  
    const posts: any = await query
      .select('posts.*')
      .select(Post.knex().raw('COUNT(*) OVER() AS total_count'))
      .offset(offset)
      .limit(pageSize);

    const total = posts[0]?.total_count ?? 0;
  
    const data = posts.map(post => ({
      id: post.id,
      userId: post.user_id,
      title: post.title,
      content: post.content,
      caption: post.caption ?? null,
    }));
  
    return {
      data,
      total,
      page,
      pageSize,
    };
  }  

  async create(input: CreatePostInput) {
    this.logger.log(`Creating post for userId=${input.userId}`);
    const user = await User.query().findById(input.userId);
    if (!user){
      this.logger.warn(`User with ID ${input.userId} not found`);
      throw new NotFoundException(`User with ID ${input.userId} not found`);
    }
  
    try {
      const post = await Post.query().insert({
        user_id: input.userId,
        title: input.title,
        content: input.content,
        caption: input.caption ?? null,
      });
  
      return {
        id: post.id,
        userId: post.user_id,
        title: post.title,
        content: post.content,
        caption: post.caption,
      };
    } catch (err) {
      this.logger.error('Error creating post: ' + err?.message );
  
      throw new BadRequestException(
        err?.message || 'Failed to create post!',
      );
    }
  }
  
}
