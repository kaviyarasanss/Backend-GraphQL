import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../db/models/users.model';
import { mockUsers, mockUser, mockCreateUserInput } from './__mocks__/users.mock';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('../db/models/users.model', () => ({
  User: {
    query: jest.fn(),
    knex: jest.fn(() => ({
      raw: jest.fn(),
    })),
  },
}));

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const page = 1;
      const pageSize = 5;
      const expectedUsers = {
        data: mockUsers.map(user => ({
          ...user,
          total_count: mockUsers.length,
        })),
        total: mockUsers.length,
        page,
        pageSize,
      };

      const mockUserQuery = {
        select: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(expectedUsers.data),
      };
      (User.query as jest.Mock).mockReturnValue(mockUserQuery);

      const result = await service.findAll(page, pageSize);
      expect(result.data).toEqual(expectedUsers.data);
      expect(result.total).toEqual(expectedUsers.total);
    });
  });

  describe('findOne', ()=> {
    it('should return a single user', async () => {
      const mockUserQuery = {
        findById: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockResolvedValue(mockUser),
      };
      (User.query as jest.Mock).mockReturnValue(mockUserQuery);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const mockUserQuery = {
        findById: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockResolvedValue(null),
      };
      (User.query as jest.Mock).mockReturnValue(mockUserQuery);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockUserQuery = {
        insert: jest.fn().mockResolvedValue(mockUser),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      };
      (User.query as jest.Mock).mockReturnValue(mockUserQuery);
      const result = await service.create(mockCreateUserInput);
      expect(result).toEqual(mockUser);
    });

    it('should throw a BadRequestException if the user already exists', async () => {
      const mockUserQuery = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockUser),
      };
      (User.query as jest.Mock).mockReturnValue(mockUserQuery);
      await expect(service.create(mockCreateUserInput)).rejects.toThrow(BadRequestException);
    });
  });
});
