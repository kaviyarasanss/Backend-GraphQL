import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { User } from '../db/models/users.model';
import { CreateUserInput } from './users.types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  async findAll(page = 1, pageSize = 5) {
    this.logger.log(`Fetching users, page=${page}, pageSize=${pageSize}`);
    const offset = (page - 1) * pageSize;

    const users: any = await User.query()
      .select('users.*')
      .select(User.knex().raw('COUNT(*) OVER() AS total_count'))
      .withGraphFetched('[posts, albums]')
      .offset(offset)
      .limit(pageSize);

    const total = users[0]?.total_count ?? 0;


    return {
      data: users,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    this.logger.log(`Fetching user with ID=${id}`);
    try {
      const user = await User.query().findById(id).withGraphFetched('[posts, albums]');
      if (!user) {
        this.logger.warn(`User with ID=${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (err) {
      this.logger.error('Error fetching user: ' + err?.message);

      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(
        err?.message || 'Failed to find user!',
      );
    }
  }

  async create(input: CreateUserInput) {
    this.logger.log(`Creating user with username=${input.username}, email=${input.email}`);
    try {
      const existing = await User.query()
        .where('email', input.email)
        .orWhere('username', input.username)
        .first();

      if (existing) {
        if (existing.email === input.email) {
          this.logger.warn(`User with email ${input.email} already exists`);
          throw new BadRequestException(`User with email ${input.email} already exists`);
        }
        if (existing.username === input.username) {
          this.logger.warn(`User with username ${input.username} already exists`);
          throw new BadRequestException(`User with username ${input.username} already exists`);
        }
      }

      const user = await User.query().insert(input);
      return user;
    } catch (err) {
      this.logger.error('Error creating user: ' + err?.message);

      throw new BadRequestException(
        err?.message || 'Failed to create user!',
      );
    }
  }

}
