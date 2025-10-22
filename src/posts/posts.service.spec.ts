import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from '../db/models/posts.model';
import { User } from '../db/models/users.model';
import { mockPosts, mockPost, mockCreatePostInput } from './__mocks__/posts.mock';
import { mockUser } from '../users/__mocks__/users.mock';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('../db/models/posts.model', () => ({
  Post: {
    query: jest.fn(),
    knex: jest.fn(() => ({
      raw: jest.fn(),
    })),
  },
}));
jest.mock('../db/models/users.model');

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findPosts', () => {
    it('should return an array of posts', async () => {
      const page = 1;
      const pageSize = 5;
      const expectedPosts = {
        data: mockPosts.map(post => ({
          id: post.id,
          userId: post.user_id,
          title: post.title,
          content: post.content,
          caption: post.caption ?? null,
        })),
        total: mockPosts.length,
        page,
        pageSize,
      };
      const mockPostQuery = {
        select: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockPosts.map(post => ({...post, total_count: mockPosts.length}))),
      };
      jest.spyOn(Post, 'query').mockReturnValue(mockPostQuery as any);

      const result = await service.findPosts(undefined, page, pageSize);
      expect(result).toEqual(expectedPosts);
    });

    it('should return an array of posts for a specific user', async () => {
      const userId = '1';
      const page = 1;
      const pageSize = 5;
      const expectedPosts = {
        data: mockPosts.map(post => ({
          id: post.id,
          userId: post.user_id,
          title: post.title,
          content: post.content,
          caption: post.caption ?? null,
        })),
        total: mockPosts.length,
        page,
        pageSize,
      };
      const mockUserQuery = {
        findById: jest.fn().mockResolvedValue(mockUser),
      };
      jest.spyOn(User, 'query').mockReturnValue(mockUserQuery as any);

      const mockPostQuery = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockPosts.map(post => ({...post, total_count: mockPosts.length}))),
      };
      jest.spyOn(Post, 'query').mockReturnValue(mockPostQuery as any);
      const result = await service.findPosts(userId, page, pageSize);
      expect(result).toEqual(expectedPosts);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const userQuery = User.query();
      jest.spyOn(userQuery, 'findById').mockResolvedValue(null);
      await expect(service.findPosts('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const expectedPost = {
        id: mockPost.id,
        userId: mockPost.user_id,
        title: mockPost.title,
        content: mockPost.content,
        caption: mockPost.caption,
      };
      const mockUserQuery = {
        findById: jest.fn().mockResolvedValue(mockUser),
      };
      jest.spyOn(User, 'query').mockReturnValue(mockUserQuery as any);

      const mockPostQuery = {
        insert: jest.fn().mockResolvedValue(mockPost),
      };
      (Post.query as jest.Mock).mockReturnValue(mockPostQuery);

      const result = await service.create(mockCreatePostInput);
      expect(result).toEqual(expectedPost);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const mockUserQuery = {
        findById: jest.fn().mockResolvedValue(null),
      };
      jest.spyOn(User, 'query').mockReturnValue(mockUserQuery as any);
      await expect(service.create(mockCreatePostInput)).rejects.toThrow(NotFoundException);
    });
  });
});
