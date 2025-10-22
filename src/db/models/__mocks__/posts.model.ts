import { mockPosts, mockPost } from '../../../posts/__mocks__/posts.mock';

const mockQuery = {
  insert: jest.fn().mockResolvedValue(mockPost),
  where: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  resultSize: jest.fn().mockResolvedValue(mockPosts.length),
};

export const Post = {
  query: jest.fn(() => mockQuery),
};
