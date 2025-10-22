import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../db/models/users.model';
import { mockUsers, mockUser, mockCreateUserInput } from './__mocks__/users.mock';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('../db/models/users.model');

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const page = 1;
      const pageSize = 5;
      const expectedUsers = {
        data: mockUsers,
        total: mockUsers.length,
        page,
        pageSize,
      };

      const query = User.query();
      jest.spyOn(query, 'withGraphFetched').mockResolvedValue(mockUsers as any);
      jest.spyOn(query, 'resultSize').mockResolvedValue(mockUsers.length);

      const result = await service.findAll(page, pageSize);
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const query = User.query();
      const findByIdSpy = jest.spyOn(query, 'findById').mockReturnThis();
      jest.spyOn(query, 'withGraphFetched').mockResolvedValue(mockUser as any);
      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const query = User.query();
      const findByIdSpy = jest.spyOn(query, 'findById').mockReturnThis();
      jest.spyOn(query, 'withGraphFetched').mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const query = User.query();
      jest.spyOn(query, 'insert').mockResolvedValue(mockUser as any);
      jest.spyOn(query, 'first').mockResolvedValue(null);
      const result = await service.create(mockCreateUserInput);
      expect(result).toEqual(mockUser);
    });

    it('should throw a BadRequestException if the user already exists', async () => {
      const query = User.query();
      jest.spyOn(query, 'first').mockResolvedValue(mockUser as any);
      await expect(service.create(mockCreateUserInput)).rejects.toThrow(BadRequestException);
    });
  });
});
