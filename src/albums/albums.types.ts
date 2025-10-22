import { ObjectType, ID, Int, InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

@ObjectType()
export class AlbumType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  genre?: string;
}

@ObjectType()
export class PaginatedAlbums {
  @Field(() => [AlbumType])
  data: AlbumType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

@InputType()
export class CreateAlbumInput {
  @Field()
  @IsNotEmpty({ message: 'UserId is required' })
  @IsUUID('4', { message: 'UserId must be a valid UUID' })
  userId: string;

  @Field()
  @IsNotEmpty({ message: 'Album name is required' })
  @IsString({ message: 'Album name must be a string' })
  @MinLength(3, { message: 'Album name must be at least 3 characters long' })
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MinLength(3, { message: 'Album name must be at least 3 characters long' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Genre must be a string' })
  @MinLength(3, { message: 'Album name must be at least 3 characters long' })
  genre?: string;
}

@InputType()
export class UpdateAlbumInput extends PartialType(CreateAlbumInput) {
  @Field()
  @IsNotEmpty({ message: 'Album ID is required' })
  @IsUUID('4', { message: 'Album ID must be a valid UUID' })
  id: string;
}