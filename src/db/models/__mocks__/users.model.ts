
import { mockUsers, mockUser } from '../../../users/__mocks__/users.mock';

const mockQuery = {
  findById: jest.fn().mockReturnThis(),
  insert: jest.fn().mockResolvedValue(mockUser),
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue(null),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  withGraphFetched: jest.fn().mockResolvedValue(mockUsers),
  resultSize: jest.fn().mockResolvedValue(mockUsers.length),
};

export const User = {
  query: jest.fn(() => mockQuery),
};
