import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { FollowsService } from './follows.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),NotificationsModule],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}