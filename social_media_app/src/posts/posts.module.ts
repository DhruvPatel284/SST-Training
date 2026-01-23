import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from 'src/users/users.module';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core'


@Module({
  imports : [
    UsersModule,
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    }
  ],
  exports: [
    TypeOrmModule
  ]
})
export class PostsModule {}
