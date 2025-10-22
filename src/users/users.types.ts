import { ObjectType, Field, ID, Int, InputType } from '@nestjs/graphql';
import { PostType } from '../posts/posts.types';
import { AlbumType } from '../albums/albums.types';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  username: string; 

  @Field()
  email: string;

  @Field(() => [PostType], { nullable: true })
  posts?: PostType[];

  @Field(() => [AlbumType], { nullable: true })
  albums?: AlbumType[];
}

@ObjectType()
export class PaginatedUsers {
  @Field(() => [UserType])
  data: UserType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}