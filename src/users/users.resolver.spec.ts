import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { mockUsers, mockUser, mockCreateUserInput } from './__mocks__/users.mock';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue({ data: mockUsers, total: mockUsers.length, page: 1, pageSize: 5 }),
            findOne: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('users', () => {
    it('should call the users service findAll method', async () => {
      const page = 1;
      const pageSize = 5;
      await resolver.users(page, pageSize);
      expect(service.findAll).toHaveBeenCalledWith(page, pageSize);
    });
  });

  describe('user', () => {
    it('should call the users service findOne method', async () => {
      const id = '1';
      await resolver.user(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('createUser', () => {
    it('should call the users service create method', async () => {
      await resolver.createUser(mockCreateUserInput);
      expect(service.create).toHaveBeenCalledWith(mockCreateUserInput);
    });
  });
});
