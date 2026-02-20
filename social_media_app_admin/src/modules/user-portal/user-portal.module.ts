import { Module } from '@nestjs/common';
import { UserDashboardController } from './controllers/web/user-dashboard-web.controller';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { UserPostsController } from './controllers/web/user-post-web.controller';
import { CommentsModule } from '../comments/comments.module';
import { UserSearchController } from './controllers/web/user-search-web.controller';
import { FollowsModule } from '../follows/follows.module';
import { UserProfileController } from './controllers/web/user-profile-web.controller';

@Module({
  imports: [
    UsersModule,  // For user data and following
    PostsModule,
    CommentsModule,
    FollowsModule // For feed posts
  ],
  controllers: [
    UserDashboardController,
    UserPostsController,
    UserSearchController,
    UserProfileController
  ]
})
export class UserPortalModule {}
