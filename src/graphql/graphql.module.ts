import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { UsersModule } from "../users/users.module";
import { PostsModule } from "../posts/posts.module";
import { AlbumsModule } from "../albums/albums.module";
import { join } from "path";
import { ApolloDriver } from "@nestjs/apollo";

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: true,
      path: "/graphql",
      formatError: (error) => ({
        message: error.message,
        code: error.extensions?.code || 'GRAPHQL_ERROR',
        locations: error?.locations,
      }),
      validationRules: [],
    }),
    UsersModule,
    PostsModule,
    AlbumsModule,
  ],
})
export class GqlModule { }
