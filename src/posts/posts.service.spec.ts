import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from '../db/models/posts.model';
import { User } from '../db/models/users.model';
import { mockPosts, mockPost, mockCreatePostInput } from './__mocks__/posts.mock';
import { mockUser } from '../users/__mocks__/users.mock';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('../db/models/posts.model');
jest.mock('../db/models/users.model');

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
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
      const postQuery = Post.query();
      jest.spyOn(postQuery, 'offset').mockReturnThis();
      jest.spyOn(postQuery, 'limit').mockResolvedValue(mockPosts as any);
      jest.spyOn(postQuery, 'resultSize').mockResolvedValue(mockPosts.length);

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
      const userQuery = User.query();
      jest.spyOn(userQuery, 'findById').mockResolvedValue(mockUser as any);
      const postQuery = Post.query();
      jest.spyOn(postQuery, 'where').mockReturnThis();
      jest.spyOn(postQuery, 'offset').mockReturnThis();
      jest.spyOn(postQuery, 'limit').mockResolvedValue(mockPosts as any);
      jest.spyOn(postQuery, 'resultSize').mockResolvedValue(mockPosts.length);
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
      const userQuery = User.query();
      jest.spyOn(userQuery, 'findById').mockResolvedValue(mockUser as any);
      const postQuery = Post.query();
      jest.spyOn(postQuery, 'insert').mockResolvedValue(mockPost as any);

      const result = await service.create(mockCreatePostInput);
      expect(result).toEqual(expectedPost);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const userQuery = User.query();
      jest.spyOn(userQuery, 'findById').mockResolvedValue(null);
      await expect(service.create(mockCreatePostInput)).rejects.toThrow(NotFoundException);
    });
  });
});
