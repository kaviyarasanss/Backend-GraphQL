import { Module, Global } from "@nestjs/common";
import knex from "knex";
import { Model } from "objection";
import KnexConfig from "../../knexfile";

@Global()
@Module({
  providers: [
    {
      provide: "KNEX",
      useFactory: async () => {
        const config = KnexConfig.development;
        const knexFile = knex(config);
        Model.knex(knexFile);
        return knexFile;
      },
    },
  ],
  exports: ["KNEX"],
})
export class DbModule {}