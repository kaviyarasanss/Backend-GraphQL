import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsResolver } from './albums.resolver';
import { AlbumsService } from './albums.service';
import { mockAlbums, mockAlbum, mockCreateAlbumInput } from './__mocks__/albums.mock';

describe('AlbumsResolver', () => {
  let resolver: AlbumsResolver;
  let service: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsResolver,
        {
          provide: AlbumsService,
          useValue: {
            findAlbums: jest.fn().mockResolvedValue({ data: mockAlbums, total: mockAlbums.length, page: 1, pageSize: 5 }),
            create: jest.fn().mockResolvedValue(mockAlbum),
            update: jest.fn().mockResolvedValue(mockAlbum),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    resolver = module.get<AlbumsResolver>(AlbumsResolver);
    service = module.get<AlbumsService>(AlbumsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('albums', () => {
    it('should call the albums service findAlbums method', async () => {
      const page = 1;
      const pageSize = 5;
      await resolver.albums(undefined, page, pageSize);
      expect(service.findAlbums).toHaveBeenCalledWith(undefined, page, pageSize);
    });
  });

  describe('createAlbum', () => {
    it('should call the albums service create method', async () => {
      const createAlbumInput = {
        userId: '1',
        name: 'quidem molestiae enim',
      };
      await resolver.createAlbum(createAlbumInput);
      expect(service.create).toHaveBeenCalledWith(createAlbumInput);
    });
  });

  describe('updateAlbum', () => {
    it('should call the albums service update method', async () => {
      const updateAlbumInput = {
        id: '1',
        name: 'new title',
      };
      await resolver.updateAlbum(updateAlbumInput);
      expect(service.update).toHaveBeenCalledWith(updateAlbumInput);
    });
  });

  describe('deleteAlbum', () => {
    it('should call the albums service delete method', async () => {
      const id = '1';
      await resolver.deleteAlbum(id);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
