import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { PostsService } from './api/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from 'src/users/users.module';
import { PostsWebController } from './web/posts.web.controller';
import { PostMedia } from './post-media.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Post,PostMedia]),
  ],
  controllers: [
    PostsController,     // API
    PostsWebController,  // WEB
  ],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
