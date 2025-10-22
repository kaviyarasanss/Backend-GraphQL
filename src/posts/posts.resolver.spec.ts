import { Test, TestingModule } from '@nestjs/testing';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { mockPosts, mockPost, mockCreatePostInput } from './__mocks__/posts.mock';

describe('PostsResolver', () => {
  let resolver: PostsResolver;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsResolver,
        {
          provide: PostsService,
          useValue: {
            findPosts: jest.fn().mockResolvedValue({ data: mockPosts, total: mockPosts.length, page: 1, pageSize: 5 }),
            create: jest.fn().mockResolvedValue(mockPost),
          },
        },
      ],
    }).compile();

    resolver = module.get<PostsResolver>(PostsResolver);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('posts', () => {
    it('should call the posts service findPosts method', async () => {
      const page = 1;
      const pageSize = 5;
      await resolver.posts(undefined, page, pageSize);
      expect(service.findPosts).toHaveBeenCalledWith(undefined, page, pageSize);
    });
  });

  describe('createPost', () => {
    it('should call the posts service create method', async () => {
      await resolver.createPost(mockCreatePostInput);
      expect(service.create).toHaveBeenCalledWith(mockCreatePostInput);
    });
  });
});
