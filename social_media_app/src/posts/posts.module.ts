import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { PostsService } from './api/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from 'src/users/users.module';
import { PostsWebController } from './web/posts.web.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [
    PostsController,     // API
    PostsWebController,  // WEB
  ],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
