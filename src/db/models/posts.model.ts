import { Model } from "objection";
import { User } from "../models/users.model";

export class Post extends Model {
  id!: string;
  user_id!: string;
  title!: string;
  content!: string;
  caption?: string | null;

  static readonly tableName = "posts";

  static readonly jsonSchema = {
    type: "object",
    required: ["user_id", "title", "content"],
    properties: {
      id: { type: "string", format: "uuid" },
      user_id: { type: "string", format: "uuid" },
      title: { type: "string", minLength: 1 },
      content: { type: "string" },
      caption: { type: ["string", "null"] },
    },
  };

  static readonly relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "posts.user_id",
        to: "users.id",
      },
    },
  };
}
