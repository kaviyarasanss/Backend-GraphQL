import { Module, Global } from "@nestjs/common";
import knex from "knex";
import { Model } from "objection";
import KnexConfig from "./knexfile";

@Global()
@Module({
  providers: [
    {
      provide: "KNEX",
      useFactory: async () => {
        const env = process.env.NODE_ENV || "development";
        const config = KnexConfig[env];
        if (!config) throw new Error(`Knex config for "${env}" not found`);
        const knexInstance = knex(config);
        Model.knex(knexInstance);
        return knexInstance;
      },
    },
  ],
  exports: ["KNEX"],
})
export class DbModule {}