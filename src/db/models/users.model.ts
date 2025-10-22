import { Model } from "objection";
import { Post } from "../models/posts.model";
import { Album } from "../models/albums.model";

export class User extends Model {
  id!: string;
  name!: string;
  username!: string;
  email!: string;

  static readonly tableName = "users";

  static readonly jsonSchema = {
    type: "object",
    required: ["name", "username", "email"],
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string", minLength: 1 },
      username: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
    },
  };

  static readonly relationMappings = {
    posts: {
      relation: Model.HasManyRelation,
      modelClass: Post,
      join: {
        from: "users.id",
        to: "posts.user_id",
      },
    },
    albums: {
      relation: Model.HasManyRelation,
      modelClass: Album,
      join: {
        from: "users.id",
        to: "albums.user_id",
      },
    },
  };
}
