import { Model } from "objection";
import { User } from "../models/users.model";

export class Album extends Model {
  id!: string;
  user_id!: string;
  name!: string;
  description?: string;
  genre?: string;

  static readonly tableName = "albums";

  static readonly jsonSchema = {
    type: "object",
    required: ["user_id", "name"],
    properties: {
      id: { type: "string", format: "uuid" },
      user_id: { type: "string", format: "uuid" },
      name: { type: "string", minLength: 1 },
      description: { type: ["string", "null"] },
      genre: { type: ["string", "null"] },
    },
  };

  static readonly relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "albums.user_id",
        to: "users.id",
      },
    },
  };
}
