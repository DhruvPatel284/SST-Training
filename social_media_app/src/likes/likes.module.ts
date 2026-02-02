import { Module } from '@nestjs/common';
import { LikesController } from './api/likes.controller';
import { LikesService } from './api/likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';
import { LikesWebController } from './web/likes.web.controller';

@Module({
  imports : [
      UsersModule,
      PostsModule,
      TypeOrmModule,
    ],
  controllers: [LikesController,LikesWebController],
  providers: [LikesService]
})
export class LikesModule {}
