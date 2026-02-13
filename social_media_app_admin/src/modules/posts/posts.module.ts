import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './post.entity';
import { PostMedia } from './post-media.entity';
import { PostsService } from './posts.service';
import { PostsWebController } from './controllers/web/posts.web.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostMedia])],
  controllers: [PostsWebController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}