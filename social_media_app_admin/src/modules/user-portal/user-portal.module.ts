import { Module } from '@nestjs/common';
import { UserDashboardController } from './controllers/web/user-dashboard-web.controller';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { UserPostsController } from './controllers/web/user-post-web.controller';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    UsersModule,  // For user data and following
    PostsModule,
    CommentsModule  // For feed posts
  ],
  controllers: [UserDashboardController,UserPostsController]
})
export class UserPortalModule {}
