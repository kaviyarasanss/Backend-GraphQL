import { mockAlbums, mockAlbum } from '../../../albums/__mocks__/albums.mock';

const mockQuery = {
  insert: jest.fn().mockResolvedValue(mockAlbum),
  where: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  resultSize: jest.fn().mockResolvedValue(mockAlbums.length),
  findById: jest.fn().mockReturnThis(),
  patchAndFetchById: jest.fn().mockReturnThis(),
  deleteById: jest.fn().mockReturnThis(),
};

export const Album = {
  query: jest.fn(() => mockQuery),
};
