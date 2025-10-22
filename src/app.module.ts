import { Module } from "@nestjs/common";
import { DbModule } from "./db/db.module";
import { GqlModule } from "./graphql/graphql.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    DbModule, GqlModule],
})
export class AppModule {}
