import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsService } from './albums.service';
import { Album } from '../db/models/albums.model';
import { User } from '../db/models/users.model';
import { mockAlbums, mockAlbum, mockCreateAlbumInput } from './__mocks__/albums.mock';
import { mockUser } from '../users/__mocks__/users.mock';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('../db/models/albums.model');
jest.mock('../db/models/users.model');

describe('AlbumsService', () => {
  let service: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumsService],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
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
          description: null,
          genre: null,
        })),
        total: mockAlbums.length,
        page,
        pageSize,
      };
      const albumQuery = Album.query();
      jest.spyOn(albumQuery, 'offset').mockReturnThis();
      jest.spyOn(albumQuery, 'limit').mockResolvedValue(mockAlbums.map(album => ({...album, user_id: album.userId} as any)));
      jest.spyOn(albumQuery, 'resultSize').mockResolvedValue(mockAlbums.length);


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
          description: null,
          genre: null,
        })),
        total: mockAlbums.length,
        page,
        pageSize,
      };
      const userQuery = User.query();
      jest.spyOn(userQuery, 'findById').mockResolvedValue(mockUser as any);
      const albumQuery = Album.query();
      jest.spyOn(albumQuery, 'where').mockReturnThis();
      jest.spyOn(albumQuery, 'offset').mockReturnThis();
      jest.spyOn(albumQuery, 'limit').mockResolvedValue(mockAlbums.map(album => ({...album, user_id: album.userId} as any)));
      jest.spyOn(albumQuery, 'resultSize').mockResolvedValue(mockAlbums.length);
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
        description: undefined,
        genre: undefined,
      };
      const userQuery = User.query();
      jest.spyOn(userQuery, 'findById').mockResolvedValue(mockUser as any);
      const albumQuery = Album.query();
      jest.spyOn(albumQuery, 'insert').mockResolvedValue({id: mockAlbum.id, user_id: mockAlbum.userId, name: mockAlbum.name, description: undefined, genre: undefined} as any);

      const result = await service.create(createAlbumInput);
      expect(result).toEqual(expectedAlbum);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const userQuery = User.query();
      jest.spyOn(userQuery, 'findById').mockResolvedValue(null);
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
      };
      const albumQuery = Album.query();
      jest.spyOn(albumQuery, 'findById').mockResolvedValue(mockAlbum as any);
      jest.spyOn(albumQuery, 'patchAndFetchById').mockResolvedValue(updatedAlbum as any);
      const result = await service.update(updateAlbumInput);
      expect(result.name).toEqual('new name');
    });

    it('should throw a NotFoundException if the album is not found', async () => {
      const albumQuery = Album.query();
      jest.spyOn(albumQuery, 'findById').mockResolvedValue(null);
      await expect(service.update({id: '1', name: 'test'})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an album', async () => {
      const albumQuery = Album.query();
      jest.spyOn(albumQuery, 'findById').mockResolvedValue(mockAlbum as any);
      jest.spyOn(albumQuery, 'deleteById').mockResolvedValue(1);
      const result = await service.delete('1');
      expect(result).toEqual(true);
    });

    it('should throw a NotFoundException if the album is not found', async () => {
      const albumQuery = Album.query();
      jest.spyOn(albumQuery, 'findById').mockResolvedValue(null);
      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
