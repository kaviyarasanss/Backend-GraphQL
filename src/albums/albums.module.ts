import { Module } from "@nestjs/common";
import { AlbumsService } from "./albums.service";
import { AlbumsResolver } from "./albums.resolver";

@Module({
  providers: [AlbumsService, AlbumsResolver],
})
export class AlbumsModule {}
