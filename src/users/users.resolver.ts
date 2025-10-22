import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType, PaginatedUsers, CreateUserInput } from './users.types';
import { Logger, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';

@Resolver(() => UserType)
export class UsersResolver {
  private readonly logger = new Logger(UsersResolver.name);
  constructor(private readonly usersService: UsersService) {}

  @Query(() => PaginatedUsers)
  async users(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize = 5,
  ) {
    this.logger.log(`Fetching all users, page=${page}, pageSize=${pageSize}`);
    return this.usersService.findAll(page, pageSize);
  }

  @Query(() => UserType)
  async user(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    this.logger.log(`Fetching user with ID=${id}`);
    return this.usersService.findOne(id);
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('input', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) input: CreateUserInput,
  ) {
    this.logger.log(`Creating user with username=${input.username}, email=${input.email}`);
    return this.usersService.create(input);
  }
}
