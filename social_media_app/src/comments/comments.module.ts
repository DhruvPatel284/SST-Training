import { Module } from '@nestjs/common';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './api/comments.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsWebController } from './web/comments.web.controller';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    TypeOrmModule.forFeature([Comment]),
  ],
  controllers: [
    CommentsController,     // API
    CommentsWebController,  // WEB
  ],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
