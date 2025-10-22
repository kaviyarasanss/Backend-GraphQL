import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsService } from './albums.service';
import { Album } from '../db/models/albums.model';
import { User } from '../db/models/users.model';
import { mockAlbums, mockAlbum, mockCreateAlbumInput } from './__mocks__/albums.mock';
import { mockUser } from '../users/__mocks__/users.mock';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('../db/models/albums.model', () => ({
  Album: {
    query: jest.fn(),
    knex: jest.fn(() => ({
      raw: jest.fn(),
    })),
  },
}));
jest.mock('../db/models/users.model');

describe('AlbumsService', () => {
  let service: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumsService],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAlbums', () => {
    it('should return an array of albums', async () => {
      const page = 1;
      const pageSize = 5;
      const expectedAlbums = {
        data: mockAlbums.map(album => ({
          id: album.id,
          userId: album.userId,
          name: album.name,
          description: album.description,
          genre: album.genre,
        })),
        total: mockAlbums.length,
        page,
        pageSize,
      };
      const mockAlbumQuery = {
        select: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockAlbums.map(album => ({...album, user_id: album.userId, total_count: mockAlbums.length}))),
      };
      jest.spyOn(Album, 'query').mockReturnValue(mockAlbumQuery as any);


      const result = await service.findAlbums(undefined, page, pageSize);
      expect(result).toEqual(expectedAlbums);
    });

    it('should return an array of albums for a specific user', async () => {
      const userId = '1';
      const page = 1;
      const pageSize = 5;
      const expectedAlbums = {
        data: mockAlbums.map(album => ({
          id: album.id,
          userId: album.userId,
          name: album.name,
          description: album.description,
          genre: album.genre,
        })),
        total: mockAlbums.length,
        page,
        pageSize,
      };
      const mockAlbumQuery = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockAlbums.map(album => ({...album, user_id: album.userId, total_count: mockAlbums.length}))),
      };
      jest.spyOn(Album, 'query').mockReturnValue(mockAlbumQuery as any);
      const result = await service.findAlbums(userId, page, pageSize);
      expect(result).toEqual(expectedAlbums);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const userQuery = User.query();
      jest.spyOn(userQuery, 'findById').mockResolvedValue(null);
      await expect(service.findAlbums('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new album', async () => {
        const createAlbumInput = {
            userId: '1',
            name: 'quidem molestiae enim',
          };
      const expectedAlbum = {
        id: mockAlbum.id,
        userId: mockAlbum.userId,
        name: mockAlbum.name,
        description: mockAlbum.description,
        genre: mockAlbum.genre,
      };
      const mockUserQuery = {
        findById: jest.fn().mockResolvedValue(mockUser),
      };
      jest.spyOn(User, 'query').mockReturnValue(mockUserQuery as any);

      const mockAlbumQuery = {
        insert: jest.fn().mockResolvedValue({
          ...mockAlbum,
          user_id: mockAlbum.userId,
        }),
      };
      (Album.query as jest.Mock).mockReturnValue(mockAlbumQuery);

      const result = await service.create(createAlbumInput);
      expect(result).toEqual(expectedAlbum);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const mockUserQuery = {
        findById: jest.fn().mockResolvedValue(null),
      };
      jest.spyOn(User, 'query').mockReturnValue(mockUserQuery as any);
      await expect(service.create({userId: '1', name: 'test'})).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an album', async () => {
      const updateAlbumInput = {
        id: '1',
        name: 'new name',
      };
      const updatedAlbum = {
        ...mockAlbum,
        name: 'new name',
        userId: mockAlbum.userId,
      };
      const mockAlbumQuery = {
        findById: jest.fn().mockResolvedValue(mockAlbum),
        patchAndFetchById: jest.fn().mockResolvedValue(updatedAlbum),
      };
      (Album.query as jest.Mock).mockReturnValue(mockAlbumQuery);
      const result = await service.update(updateAlbumInput);
      expect(result.name).toEqual('new name');
    });

    it('should throw a NotFoundException if the album is not found', async () => {
      const mockAlbumQuery = {
        findById: jest.fn().mockResolvedValue(null),
      };
      (Album.query as jest.Mock).mockReturnValue(mockAlbumQuery);
      await expect(service.update({id: '1', name: 'test'})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an album', async () => {
      const mockUserQuery = {
        findById: jest.fn().mockResolvedValue(mockUser),
      };
      jest.spyOn(User, 'query').mockReturnValue(mockUserQuery as any);
  
      const mockAlbumQuery = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockAlbum),
        deleteById: jest.fn().mockResolvedValue(1),
      };
      jest.spyOn(Album, 'query').mockReturnValue(mockAlbumQuery as any);
  
      const result = await service.delete('1', '1');
      expect(result).toEqual(true);
    });
  
    it('should throw a NotFoundException if the album is not found for the user', async () => {
      const mockUserQuery = {
        findById: jest.fn().mockResolvedValue(mockUser),
      };
      jest.spyOn(User, 'query').mockReturnValue(mockUserQuery as any);
  
      const mockAlbumQuery = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      };
      jest.spyOn(Album, 'query').mockReturnValue(mockAlbumQuery as any);
  
      await expect(service.delete('1', '1')).rejects.toThrow(NotFoundException);
    });
  });
});
