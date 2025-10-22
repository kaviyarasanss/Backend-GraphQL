import { ObjectType, Field, ID, Int, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

@ObjectType()
export class PostType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  caption?: string;
}

@ObjectType()
export class PaginatedPosts {
  @Field(() => [PostType])
  data: PostType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty({ message: 'UserId is required' })
  @IsUUID('4',{ message: 'UserId must be a valid UUID' })
  userId: string;

  @Field()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @Field()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(3, { message: 'Content must be at least 3 characters long' })
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Caption must be a string' })
  @MinLength(3, { message: 'Content must be at least 3 characters long' })
  caption?: string;
}