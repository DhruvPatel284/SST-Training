import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports : [
      UsersModule,
      PostsModule,
      TypeOrmModule,
    ],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
