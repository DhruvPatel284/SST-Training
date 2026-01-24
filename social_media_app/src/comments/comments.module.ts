import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { PostsModule } from 'src/posts/posts.module';
import { CurrentPostInterceptor } from './interceptors/current-post.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core'
@Module({
  imports : [
    UsersModule,
    PostsModule,
    TypeOrmModule.forFeature([Comment]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CurrentPostInterceptor
  ],
  exports:[
    TypeOrmModule,
    CommentsService,
  ]
})
export class CommentsModule {}
